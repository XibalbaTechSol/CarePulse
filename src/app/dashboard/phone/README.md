# Phone & VoIP Module

The Phone module provides integrated voice communication capabilities directly within the CarePulse dashboard.

## Features
- **Dialer**: In-browser dialing with mute, hold, and transfer capabilities.
- **Call History**: Log of incoming, outgoing, and missed calls.
- **Voicemail**: Visual voicemail interface with playback.
- **Micro-CRM**: Built-in "Add Contact" feature to save callers directly to the agency CRM.
- **Active Call Handling**: Real-time call status indication.

## Architecture
- **Twilio Integration**: Powered by Twilio SDK (client-side) and TwiML (server-side).
- **WebSockets**: Real-time events for incoming calls.
- **State Management**: Uses React context or local state to manage call status.

## Usage
Navigate to `/dashboard/phone` to access the dialer. ensure you have granted microphone permissions.
