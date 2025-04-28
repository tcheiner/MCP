# An LLM-Powered Chatbot MCP Client written in Python

See the [Building MCP clients](https://modelcontextprotocol.io/tutorials/building-a-client) tutorial for more information.

# Template for client code:
- declared as a class:
    - initialized a default construction that has a session, exit stack and api type
    - function to connect to server
    - function to request/receive request/response from generative chat of choice
    - function to run a continuous chat (loop) till a determined exit
    - cleanup function
