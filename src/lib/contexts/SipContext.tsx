'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAgent, SessionState, Inviter, Registerer, Invitation } from 'sip.js';

interface SipState {
    status: 'DISCONNECTED' | 'CONNECTED' | 'REGISTERING' | 'ERROR';
    activeCall: boolean;
    invitation: Invitation | null;
    callDetails: {
        number: string;
        duration: number;
        direction: 'INBOUND' | 'OUTBOUND';
        status: 'RINGING' | 'CONNECTED' | 'HELD' | 'IDLE';
    } | null;
}
interface SipConfig {
    username: string;
    domain: string;
    password?: string;
    websocketUrl: string;
}

interface SipContextType {
    state: SipState;
    makeCall: (number: string) => void;
    endCall: () => void;
    answerCall: () => void;
    rejectCall: () => void;
    toggleHold: () => void;
}

const SipContext = createContext<SipContextType | undefined>(undefined);

export function SipProvider({ children, sipConfig }: { children: React.ReactNode; sipConfig?: SipConfig | null }) {
    const [state, setState] = useState<SipState>({
        status: 'DISCONNECTED',
        activeCall: false,
        invitation: null,
        callDetails: null,
    });
    const [ua, setUa] = useState<UserAgent | null>(null);

    useEffect(() => {
        if (sipConfig && sipConfig.websocketUrl && sipConfig.username) {
            // Using a functional update or moved outside might fix the lint, 
            // but for now we just want logic correctness.
            // avoiding direct setState if possible or acknowledge it.

            let userAgent: UserAgent;

            const setupSip = async () => {
                setState(s => ({ ...s, status: 'REGISTERING' }));
                try {
                    userAgent = new UserAgent({
                        uri: UserAgent.makeURI(`sip:${sipConfig.username}@${sipConfig.domain}`),
                        transportOptions: {
                            server: sipConfig.websocketUrl
                        },
                        authorizationUsername: sipConfig.username,
                        authorizationPassword: sipConfig.password,
                        delegate: {
                            onConnect: () => {
                                setState(s => ({ ...s, status: 'CONNECTED' }));
                            },
                            onDisconnect: (error) => {
                                setState(s => ({ ...s, status: 'DISCONNECTED' }));
                                if (error) console.error('SIP Disconnected:', error);
                            },
                            onInvite: (invitation) => {
                                console.log('Incoming call:', invitation);
                                setState(prev => ({
                                    ...prev,
                                    activeCall: true,
                                    invitation: invitation,
                                    callDetails: {
                                        number: invitation.remoteIdentity.uri.user || 'Unknown',
                                        duration: 0,
                                        direction: 'INBOUND',
                                        status: 'RINGING'
                                    }
                                }));

                                // Handle invitation state changes (e.g. if caller cancels)
                                invitation.stateChange.addListener((state) => {
                                    if (state === SessionState.Terminated) {
                                        setState(prev => ({
                                            ...prev,
                                            activeCall: false,
                                            invitation: null,
                                            callDetails: null
                                        }));
                                    }
                                });
                            }
                        }
                    });

                    await userAgent.start();
                    setUa(userAgent);

                    // Register
                    const registerer = new Registerer(userAgent);
                    await registerer.register();

                } catch (e) {
                    console.error("SIP Setup Error:", e);
                    setState(s => ({ ...s, status: 'ERROR' }));
                }
            };

            setupSip();

            return () => {
                if (userAgent) {
                    userAgent.stop();
                }
            };
        }
    }, [sipConfig]);

    const makeCall = async (number: string) => {
        if (!ua || state.status !== 'CONNECTED' || !sipConfig) {
            console.error('SIP User Agent not ready or config missing');
            alert("SIP not connected. Please check your settings.");
            return;
        }

        const target = UserAgent.makeURI(`sip:${number}@${sipConfig.domain}`);
        if (!target) return;

        const inviter = new Inviter(ua, target);

        inviter.stateChange.addListener((newState: SessionState) => {
            if (newState === SessionState.Established) {
                setState((prev: SipState) => ({
                    ...prev,
                    activeCall: true,
                    callDetails: { number, duration: 0, direction: 'OUTBOUND', status: 'CONNECTED' }
                }));
            } else if (newState === SessionState.Terminated) {
                endCall();
            }
        });

        await inviter.invite();
    };

    const endCall = () => {
        setState((prev: SipState) => ({
            ...prev,
            activeCall: false,
            callDetails: null
        }));
    };

    const answerCall = () => {
        if (state.invitation && state.callDetails?.status === 'RINGING') {
            state.invitation.accept();
            setState(prev => ({
                ...prev,
                callDetails: {
                    ...prev.callDetails!,
                    status: 'CONNECTED',
                    duration: 0
                }
            }));
        } else {
            // Fallback for demo if no real invitation object
            if (state.callDetails?.status === 'RINGING') {
                setState(prev => ({
                    ...prev,
                    callDetails: {
                        ...prev.callDetails!,
                        status: 'CONNECTED',
                        duration: 0
                    }
                }));
            }
        }
    };

    const rejectCall = () => {
        if (state.invitation) {
            state.invitation.reject();
        }
        endCall();
    };

    const toggleHold = () => {
        if (state.callDetails) {
            setState((prev: SipState) => ({
                ...prev,
                callDetails: {
                    ...prev.callDetails!,
                    status: prev.callDetails!.status === 'HELD' ? 'CONNECTED' : 'HELD'
                }
            }));
        }
    };

    return (
        <SipContext.Provider value={{ state, makeCall, endCall, answerCall, rejectCall, toggleHold }}>
            {children}
        </SipContext.Provider>
    );
}

export const useSip = () => {
    const context = useContext(SipContext);
    if (context === undefined) {
        throw new Error('useSip must be used within a SipProvider');
    }
    return context;
};
