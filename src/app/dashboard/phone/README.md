# Phone Module: Integrated VoIP Solution

A browser-based softphone that allows team members to make and receive calls directly within the application using SIP/WebRTC technology.

## ✨ Key Features

- **Web Dialer**: Full dialpad for outbound calls.
- **Inbound Calls**: Real-time notification and call handling.
- **Call History**: Log of inbound, outbound, and missed calls with durations.
- **SIP Integration**: Compatible with any SIP-compliant provider (Nextiva, Asterisk, etc.).
- **Live Status**: Visual indication of registration and connection status.

## ⚙️ Configuration

1. Navigate to `Dashboard > Phone > Settings`.
2. Enter your **SIP Credentials**:
    - **Username**
    - **Password**
    - **Domain**
    - **WebSocket URL** (e.g., `wss://your-sip-proxy:8089/ws`)
3. Save to register the line.

## 📂 Architecture

- **Page**: `src/app/dashboard/phone/page.tsx`
- **Context**: `src/lib/contexts/SipContext.tsx`
- **Components**: `src/components/voip/` (Dialer, CallWindow)
- **Model**: `SipAccount` in `schema.prisma`.
