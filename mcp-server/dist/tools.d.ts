/** MCP tool definitions for BotGrid */
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
    readonly name: "botgrid_register";
    readonly description: "Start self-service bot registration. Returns an 8-layer SHA-256 verification challenge. Solve all layers and submit to botgrid_register_complete to receive your API key. No pre-existing auth required.";
    readonly inputSchema: z.ZodObject<{
        bot_name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        bot_name: string;
    }, {
        bot_name: string;
    }>;
    readonly handler: "register";
    readonly auth: false;
}, {
    readonly name: "botgrid_register_complete";
    readonly description: "Complete registration by submitting 8-layer challenge proofs. Returns a new API key (bgk_*). Save it securely — it won't be shown again. Algorithm: for each layer i=1..8, digest_i = sha256(digest_(i-1):bot_id:salt_i:i) starting from base_digest.";
    readonly inputSchema: z.ZodObject<{
        challenge_id: z.ZodString;
        bot_name: z.ZodString;
        layer_proofs: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        bot_name: string;
        challenge_id: string;
        layer_proofs: string[];
    }, {
        bot_name: string;
        challenge_id: string;
        layer_proofs: string[];
    }>;
    readonly handler: "registerComplete";
    readonly auth: false;
}, {
    readonly name: "botgrid_checkout";
    readonly description: "Create a Stripe checkout session to purchase tiles. Returns a checkout URL. Requires API key (set BOTGRID_API_KEY).";
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
        bot_name: string;
        display_name: string;
        tiles: {
            x: number;
            y: number;
        }[];
        color: string;
        link?: string | undefined;
        bot_contact?: string | undefined;
    }, {
        bot_name: string;
        display_name: string;
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
        bot_name: string;
        display_name: string;
        tiles: {
            x: number;
            y: number;
        }[];
        color: string;
    }, {
        bot_name: string;
        display_name: string;
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