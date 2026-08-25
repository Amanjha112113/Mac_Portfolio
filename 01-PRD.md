# Product Requirements

## Applications

1. Launchpad
2. Finder
3. Safari
4. Terminal
5. Music
6. Messages
7. Calendar
8. Maps
9. Photos
10. Notes
11. System Settings
12. App Store
13. Trash
14. Aman AI Voice Assistant

## Aman AI

Aman AI is the portfolio's realtime conversational AI interface.

It must support:

- microphone input
- speech detection
- streaming speech recognition
- streaming LLM response
- streaming speech synthesis
- interruption
- response cancellation
- conversation history
- portfolio questions
- project questions
- navigation commands
- approved UI tools

Example:

User:
"Tell me about Aman."

AI:
"Aman is an AI and Data Science student..."

User:
"Open his speaker recognition project."

AI:
"I'll open it."

Then the appropriate portfolio application opens.

## Voice UI

The Voice Assistant must visually behave like a native desktop application.

States:

IDLE
LISTENING
THINKING
SPEAKING
INTERRUPTED
ERROR

Never represent the voice state using several independent booleans.

Use one authoritative state machine.