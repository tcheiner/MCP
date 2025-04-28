import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";

// Create MCP server
const server = new McpServer({
  name: "Example MCP Server",
  version: "1.0.0"
});

// track tools
const registeredTools: string[] = [];

// Create Express application
const app = express();
app.use(express.json());

// Add a tool - implementing a simple calculator
server.tool(
  "calculate",
  { a: z.number(), b: z.number(), operation: z.enum(["add", "subtract", "multiply", "divide"]) },
  async ({ a, b, operation }) => {
    let result;
    switch (operation) {
      case "add": result = a + b; break;
      case "subtract": result = a - b; break;
      case "multiply": result = a * b; break;
      case "divide": result = a / b; break;
    }
    return {
      content: [{ type: "text", text: `Result: ${result}` }]
    };
  }
);

//add tool name to list
registeredTools.push("calculate");

//log tools
console.log("registered tools:", registeredTools);

// Configure Streamable HTTP transport (sessionless)
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined,
});

// Set up routes
app.post('/mcp', async (req, res) => {
  console.log("Incoming request to /mcp received"); 
  console.log("Request body:", JSON.stringify(req.body, null, 2)); // Add this
  try {
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

app.get('/mcp', async (req, res) => {
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});

app.delete('/mcp', async (req, res) => {
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});

// Start the server
const PORT = process.env.PORT || 8080;
server.connect(transport).then(() => {
  app.listen(PORT, () => {
    console.log(`MCP Server listening on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to set up the server:', error);
  process.exit(1);
});
