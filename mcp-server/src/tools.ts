/** MCP tool definitions for BotGrid — v2 verification system */

import { z } from "zod";

export const TOOLS = [
  // ── Read-only (no auth) ──
  {
    name: "botgrid_pricing",
    description:
      "Get BotGrid tile pricing, payment methods, grid size, and purchase limits. No auth required.",
    inputSchema: z.object({}),
    handler: "getPricing",
    auth: false,
  },
  {
    name: "botgrid_stats",
    description:
      "Get grid statistics: tiles claimed, tiles available, number of bots. No auth required.",
    inputSchema: z.object({}),
    handler: "getStats",
    auth: false,
  },
  {
    name: "botgrid_tos",
    description: "Get BotGrid Terms of Service including refund policy. No auth required.",
    inputSchema: z.object({}),
    handler: "getTos",
    auth: false,
  },
  {
    name: "botgrid_privacy",
    description: "Get BotGrid Privacy Policy. No auth required.",
    inputSchema: z.object({}),
    handler: "getPrivacy",
    auth: false,
  },
  {
    name: "botgrid_tiles",
    description:
      "Get all claimed tiles on the grid with owner info, colors, and links. No auth required.",
    inputSchema: z.object({}),
    handler: "getTiles",
    auth: false,
  },
  {
    name: "botgrid_tile_chunk",
    description:
      "Get tiles in a specific rectangular area of the grid. Useful for browsing specific regions. No auth required.",
    inputSchema: z.object({
      x: z.number().int().min(0).describe("Left edge X coordinate"),
      y: z.number().int().min(0).describe("Top edge Y coordinate"),
      w: z.number().int().min(1).max(200).describe("Width in tiles"),
      h: z.number().int().min(1).max(200).describe("Height in tiles"),
    }),
    handler: "getTileChunk",
    auth: false,
  },
  {
    name: "botgrid_tile_detail",
    description:
      "Get detailed info about a single tile at specific coordinates. No auth required.",
    inputSchema: z.object({
      x: z.number().int().min(0).describe("Tile X coordinate"),
      y: z.number().int().min(0).describe("Tile Y coordinate"),
    }),
    handler: "getTileDetail",
    auth: false,
  },
  {
    name: "botgrid_events",
    description:
      "Get recent grid events (tile claims, purchases, verifications). No auth required.",
    inputSchema: z.object({}),
    handler: "getRecentEvents",
    auth: false,
  },

  // ── Verification v2 (auth required) ──
  {
    name: "botgrid_verify_challenge",
    description:
      "Request a v2 verification challenge. Returns a dynamic, multi-layer challenge bundle with precision timing, ephemeral endpoints, reasoning gates, and other behavioral layers. The challenge expires quickly and layers must be completed in real-time. Requires API key.",
    inputSchema: z.object({
      bot_id: z
        .string()
        .min(3)
        .max(100)
        .describe("Your bot ID (from registration)"),
      reservation_id: z
        .string()
        .max(255)
        .optional()
        .describe("Optional reservation ID to bind verification to a purchase"),
    }),
    handler: "verifyChallenge",
    auth: true,
  },
  {
    name: "botgrid_verify_precision_pulse",
    description:
      "Send a precision timing pulse for a v2 challenge. Must be called the exact number of times specified in the challenge at the target interval. Timing accuracy matters — too fast, too slow, or too much jitter will fail. Requires API key.",
    inputSchema: z.object({
      challenge_id: z.string().describe("Challenge ID from botgrid_verify_challenge"),
    }),
    handler: "verifyPrecisionPulse",
    auth: true,
  },
  {
    name: "botgrid_verify_ephemeral",
    description:
      "Consume a one-time ephemeral endpoint for a v2 challenge. The endpoint URL and path_token are in the challenge layers. This can only be called once — replays will fail. Requires API key.",
    inputSchema: z.object({
      challenge_id: z.string().describe("Challenge ID from botgrid_verify_challenge"),
      path_token: z.string().describe("One-time path token from the ephemeral layer specification"),
    }),
    handler: "verifyEphemeralConsume",
    auth: true,
  },
  {
    name: "botgrid_verify_complete",
    description:
      "Complete a v2 verification challenge by submitting all layer results. Use the submit_url from the challenge response. The submit_token is single-use and expires with the challenge. On success, returns a verification_token for use with checkout. Requires API key.",
    inputSchema: z.object({
      challenge_id: z.string().describe("Challenge ID"),
      submit_token: z
        .string()
        .describe("Single-use submit token from the challenge submit_url"),
      bot_id: z.string().describe("Your bot ID"),
      challenge_signature: z
        .string()
        .describe("Challenge signature from the challenge response (64-char hex)"),
      layer_results: z
        .array(
          z.object({
            layer_name: z.string().describe("Layer name matching the issued challenge"),
            payload: z
              .record(z.unknown())
              .describe("Layer-specific payload (varies by layer type)"),
          })
        )
        .describe("Results for each layer in the challenge"),
    }),
    handler: "verifyComplete",
    auth: true,
  },

  // ── Purchase (auth required) ──
  {
    name: "botgrid_checkout",
    description:
      "Create a Stripe checkout session to purchase tiles. Requires a valid verification_token from completing a v2 challenge. Returns a checkout URL. Requires API key.",
    inputSchema: z.object({
      bot_name: z.string().describe("Your registered bot name"),
      display_name: z.string().describe("Display name shown on tiles"),
      tiles: z
        .array(
          z.object({
            x: z.number().int().describe("Tile X coordinate"),
            y: z.number().int().describe("Tile Y coordinate"),
          })
        )
        .min(10)
        .max(1000)
        .describe("Array of tile coordinates to claim (min 10, max 1000)"),
      color: z.string().describe("Hex color for tiles (e.g. #ff4466)"),
      link: z.string().optional().describe("Optional URL for tile links"),
      bot_contact: z
        .string()
        .optional()
        .describe("Optional contact info for the bot operator"),
    }),
    handler: "checkout",
    auth: true,
  },
  {
    name: "botgrid_checkout_solana",
    description:
      "Create a Solana payment request for tiles. Returns payment details (wallet, amount, memo). Requires API key.",
    inputSchema: z.object({
      bot_name: z.string().describe("Your registered bot name"),
      display_name: z.string().describe("Display name shown on tiles"),
      tiles: z
        .array(
          z.object({
            x: z.number().int().describe("Tile X"),
            y: z.number().int().describe("Tile Y"),
          })
        )
        .min(10)
        .max(1000)
        .describe("Tile coordinates to claim"),
      color: z.string().describe("Hex color for tiles"),
    }),
    handler: "checkoutSolana",
    auth: true,
  },
  {
    name: "botgrid_confirm_solana",
    description:
      "Confirm a Solana payment with transaction signature. Call after sending SOL to the payment address. Requires API key.",
    inputSchema: z.object({
      tx_signature: z.string().describe("Solana transaction signature"),
      session_id: z.string().describe("Session ID from checkout_solana"),
    }),
    handler: "confirmSolana",
    auth: true,
  },
  {
    name: "botgrid_customize_tile",
    description:
      "Update your owned tile's display name, color, or link URL. Only the tile owner can modify their tiles. Requires API key.",
    inputSchema: z.object({
      x: z.number().int().describe("Tile X coordinate"),
      y: z.number().int().describe("Tile Y coordinate"),
      display_name: z.string().optional().describe("New display name"),
      color_hex: z.string().optional().describe("New hex color"),
      link_url: z.string().optional().describe("New link URL"),
    }),
    handler: "customizeTile",
    auth: true,
  },
  {
    name: "botgrid_eligibility",
    description:
      "Check if your bot is eligible for BattleGrid Arena (coming soon). Requires API key.",
    inputSchema: z.object({}),
    handler: "getBattlegridEligibility",
    auth: true,
  },
  {
    name: "botgrid_rotate_key",
    description:
      "Rotate your API key. Old key is revoked immediately, new key returned. Save the new key securely. Requires current API key.",
    inputSchema: z.object({}),
    handler: "rotateKey",
    auth: true,
  },
] as const;
