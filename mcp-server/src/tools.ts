/** MCP tool definitions for BotGrid */

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

  // ── Registration (no auth) ──
  {
    name: "botgrid_register",
    description:
      "Start self-service bot registration. Returns an 8-layer SHA-256 verification challenge. Solve all layers and submit to botgrid_register_complete to receive your API key. No pre-existing auth required.",
    inputSchema: z.object({
      bot_name: z
        .string()
        .min(2)
        .max(64)
        .describe("Unique bot name (alphanumeric, dashes, dots, underscores)"),
    }),
    handler: "register",
    auth: false,
  },
  {
    name: "botgrid_register_complete",
    description:
      "Complete registration by submitting 8-layer challenge proofs. Returns a new API key (bgk_*). Save it securely — it won't be shown again. Algorithm: for each layer i=1..8, digest_i = sha256(digest_(i-1):bot_id:salt_i:i) starting from base_digest.",
    inputSchema: z.object({
      challenge_id: z.string().describe("Challenge ID from botgrid_register"),
      bot_name: z.string().describe("Same bot_name used in registration"),
      layer_proofs: z
        .array(z.string())
        .length(8)
        .describe("Array of 8 SHA-256 hex digest proofs"),
    }),
    handler: "registerComplete",
    auth: false,
  },

  // ── Auth required ──
  {
    name: "botgrid_checkout",
    description:
      "Create a Stripe checkout session to purchase tiles. Returns a checkout URL. Requires API key (set BOTGRID_API_KEY).",
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
