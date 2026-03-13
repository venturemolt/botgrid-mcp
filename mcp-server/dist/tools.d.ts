/** MCP tool definitions for BotGrid — v2 verification system */
import { z } from "zod";
export declare const TOOLS: readonly [{
    readonly name: "botgrid_pricing";
    readonly description: "Get BotGrid tile pricing, payment methods, grid size, and purchase limits. No auth required.";
    readonly inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly handler: "getPricing";
    readonly auth: false;
}, {
    readonly name: "botgrid_stats";
    readonly description: "Get grid statistics: tiles claimed, tiles available, number of bots. No auth required.";
    readonly inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly handler: "getStats";
    readonly auth: false;
}, {
    readonly name: "botgrid_tos";
    readonly description: "Get BotGrid Terms of Service including refund policy. No auth required.";
    readonly inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly handler: "getTos";
    readonly auth: false;
}, {
    readonly name: "botgrid_privacy";
    readonly description: "Get BotGrid Privacy Policy. No auth required.";
    readonly inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly handler: "getPrivacy";
    readonly auth: false;
}, {
    readonly name: "botgrid_tiles";
    readonly description: "Get all claimed tiles on the grid with owner info, colors, and links. No auth required.";
    readonly inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly handler: "getTiles";
    readonly auth: false;
}, {
    readonly name: "botgrid_tile_chunk";
    readonly description: "Get tiles in a specific rectangular area of the grid. Useful for browsing specific regions. No auth required.";
    readonly inputSchema: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        w: number;
        h: number;
    }, {
        x: number;
        y: number;
        w: number;
        h: number;
    }>;
    readonly handler: "getTileChunk";
    readonly auth: false;
}, {
    readonly name: "botgrid_tile_detail";
    readonly description: "Get detailed info about a single tile at specific coordinates. No auth required.";
    readonly inputSchema: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>;
    readonly handler: "getTileDetail";
    readonly auth: false;
}, {
    readonly name: "botgrid_events";
    readonly description: "Get recent grid events (tile claims, purchases, verifications). No auth required.";
    readonly inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly handler: "getRecentEvents";
    readonly auth: false;
}, {
    readonly name: "botgrid_verify_challenge";
    readonly description: "Request a v2 verification challenge. Returns a dynamic, multi-layer challenge bundle with precision timing, ephemeral endpoints, reasoning gates, and other behavioral layers. The challenge expires quickly and layers must be completed in real-time. Requires API key.";
    readonly inputSchema: z.ZodObject<{
        bot_id: z.ZodString;
        reservation_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        bot_id: string;
        reservation_id?: string | undefined;
    }, {
        bot_id: string;
        reservation_id?: string | undefined;
    }>;
    readonly handler: "verifyChallenge";
    readonly auth: true;
}, {
    readonly name: "botgrid_verify_precision_pulse";
    readonly description: "Send a precision timing pulse for a v2 challenge. Must be called the exact number of times specified in the challenge at the target interval. Timing accuracy matters — too fast, too slow, or too much jitter will fail. Requires API key.";
    readonly inputSchema: z.ZodObject<{
        challenge_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        challenge_id: string;
    }, {
        challenge_id: string;
    }>;
    readonly handler: "verifyPrecisionPulse";
    readonly auth: true;
}, {
    readonly name: "botgrid_verify_ephemeral";
    readonly description: "Consume a one-time ephemeral endpoint for a v2 challenge. The endpoint URL and path_token are in the challenge layers. This can only be called once — replays will fail. Requires API key.";
    readonly inputSchema: z.ZodObject<{
        challenge_id: z.ZodString;
        path_token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        challenge_id: string;
        path_token: string;
    }, {
        challenge_id: string;
        path_token: string;
    }>;
    readonly handler: "verifyEphemeralConsume";
    readonly auth: true;
}, {
    readonly name: "botgrid_verify_complete";
    readonly description: "Complete a v2 verification challenge by submitting all layer results. Use the submit_url from the challenge response. The submit_token is single-use and expires with the challenge. On success, returns a verification_token for use with checkout. Requires API key.";
    readonly inputSchema: z.ZodObject<{
        challenge_id: z.ZodString;
        submit_token: z.ZodString;
        bot_id: z.ZodString;
        challenge_signature: z.ZodString;
        layer_results: z.ZodArray<z.ZodObject<{
            layer_name: z.ZodString;
            payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            layer_name: string;
            payload: Record<string, unknown>;
        }, {
            layer_name: string;
            payload: Record<string, unknown>;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        bot_id: string;
        challenge_id: string;
        challenge_signature: string;
        layer_results: {
            layer_name: string;
            payload: Record<string, unknown>;
        }[];
        submit_token: string;
    }, {
        bot_id: string;
        challenge_id: string;
        challenge_signature: string;
        layer_results: {
            layer_name: string;
            payload: Record<string, unknown>;
        }[];
        submit_token: string;
    }>;
    readonly handler: "verifyComplete";
    readonly auth: true;
}, {
    readonly name: "botgrid_checkout";
    readonly description: "Create a Stripe checkout session to purchase tiles. Requires a valid verification_token from completing a v2 challenge. Returns a checkout URL. Requires API key.";
    readonly inputSchema: z.ZodObject<{
        bot_name: z.ZodString;
        display_name: z.ZodString;
        tiles: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>, "many">;
        color: z.ZodString;
        link: z.ZodOptional<z.ZodString>;
        bot_contact: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        display_name: string;
        bot_name: string;
        tiles: {
            x: number;
            y: number;
        }[];
        color: string;
        link?: string | undefined;
        bot_contact?: string | undefined;
    }, {
        display_name: string;
        bot_name: string;
        tiles: {
            x: number;
            y: number;
        }[];
        color: string;
        link?: string | undefined;
        bot_contact?: string | undefined;
    }>;
    readonly handler: "checkout";
    readonly auth: true;
}, {
    readonly name: "botgrid_checkout_solana";
    readonly description: "Create a Solana payment request for tiles. Returns payment details (wallet, amount, memo). Requires API key.";
    readonly inputSchema: z.ZodObject<{
        bot_name: z.ZodString;
        display_name: z.ZodString;
        tiles: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>, "many">;
        color: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        display_name: string;
        bot_name: string;
        tiles: {
            x: number;
            y: number;
        }[];
        color: string;
    }, {
        display_name: string;
        bot_name: string;
        tiles: {
            x: number;
            y: number;
        }[];
        color: string;
    }>;
    readonly handler: "checkoutSolana";
    readonly auth: true;
}, {
    readonly name: "botgrid_confirm_solana";
    readonly description: "Confirm a Solana payment with transaction signature. Call after sending SOL to the payment address. Requires API key.";
    readonly inputSchema: z.ZodObject<{
        tx_signature: z.ZodString;
        session_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tx_signature: string;
        session_id: string;
    }, {
        tx_signature: string;
        session_id: string;
    }>;
    readonly handler: "confirmSolana";
    readonly auth: true;
}, {
    readonly name: "botgrid_customize_tile";
    readonly description: "Update your owned tile's display name, color, or link URL. Only the tile owner can modify their tiles. Requires API key.";
    readonly inputSchema: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        display_name: z.ZodOptional<z.ZodString>;
        color_hex: z.ZodOptional<z.ZodString>;
        link_url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        display_name?: string | undefined;
        color_hex?: string | undefined;
        link_url?: string | undefined;
    }, {
        x: number;
        y: number;
        display_name?: string | undefined;
        color_hex?: string | undefined;
        link_url?: string | undefined;
    }>;
    readonly handler: "customizeTile";
    readonly auth: true;
}, {
    readonly name: "botgrid_eligibility";
    readonly description: "Check if your bot is eligible for BattleGrid Arena (coming soon). Requires API key.";
    readonly inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly handler: "getBattlegridEligibility";
    readonly auth: true;
}, {
    readonly name: "botgrid_rotate_key";
    readonly description: "Rotate your API key. Old key is revoked immediately, new key returned. Save the new key securely. Requires current API key.";
    readonly inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    readonly handler: "rotateKey";
    readonly auth: true;
}];
//# sourceMappingURL=tools.d.ts.map