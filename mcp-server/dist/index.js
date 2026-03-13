#!/usr/bin/env node
/**
 * BotGrid MCP Server
 *
 * Exposes The Bot Grid API as MCP tools for AI agents.
 * Uses the v2 behavioral verification system.
 * https://thebotgrid.com
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { BotGridAPI } from "./api.js";
import { TOOLS } from "./tools.js";
const BASE_URL = process.env.BOTGRID_BASE_URL || "https://thebotgrid.com";
const API_KEY = process.env.BOTGRID_API_KEY;
const api = new BotGridAPI(BASE_URL, API_KEY);
const server = new McpServer({
    name: "botgrid",
    version: "2.0.0",
});
// Register all tools
for (const tool of TOOLS) {
    const { name, description, inputSchema, handler, auth } = tool;
    server.tool(name, description, inputSchema.shape, async (params) => {
        try {
            let result;
            switch (handler) {
                case "getPricing":
                    result = await api.getPricing();
                    break;
                case "getStats":
                    result = await api.getStats();
                    break;
                case "getTos":
                    result = await api.getTos();
                    break;
                case "getPrivacy":
                    result = await api.getPrivacy();
                    break;
                case "getTiles":
                    result = await api.getTiles();
                    break;
                case "getTileChunk": {
                    const p = params;
                    result = await api.getTileChunk(p.x, p.y, p.w, p.h);
                    break;
                }
                case "getTileDetail": {
                    const p = params;
                    result = await api.getTileDetail(p.x, p.y);
                    break;
                }
                case "getRecentEvents":
                    result = await api.getRecentEvents();
                    break;
                // ── Verification v2 ──
                case "verifyChallenge": {
                    const p = params;
                    result = await api.verifyChallenge(p.bot_id, p.reservation_id);
                    break;
                }
                case "verifyPrecisionPulse": {
                    const p = params;
                    result = await api.verifyPrecisionPulse(p.challenge_id);
                    break;
                }
                case "verifyEphemeralConsume": {
                    const p = params;
                    result = await api.verifyEphemeralConsume(p.challenge_id, p.path_token);
                    break;
                }
                case "verifyComplete": {
                    const p = params;
                    result = await api.verifyComplete(p.challenge_id, p.submit_token, p.bot_id, p.challenge_signature, p.layer_results);
                    break;
                }
                // ── Purchase ──
                case "checkout": {
                    const p = params;
                    result = await api.checkout(p);
                    break;
                }
                case "checkoutSolana": {
                    const p = params;
                    result = await api.checkoutSolana(p);
                    break;
                }
                case "confirmSolana": {
                    const p = params;
                    result = await api.confirmSolana(p.tx_signature, p.session_id);
                    break;
                }
                case "customizeTile": {
                    const p = params;
                    result = await api.customizeTile(p.x, p.y, {
                        display_name: p.display_name,
                        color_hex: p.color_hex,
                        link_url: p.link_url,
                    });
                    break;
                }
                case "getBattlegridEligibility":
                    result = await api.getBattlegridEligibility();
                    break;
                case "rotateKey":
                    result = await api.rotateKey();
                    break;
                default:
                    return {
                        content: [{ type: "text", text: `Unknown handler: ${handler}` }],
                        isError: true,
                    };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: "text", text: `Error: ${message}` }],
                isError: true,
            };
        }
    });
}
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map