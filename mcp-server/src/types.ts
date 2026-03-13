/** BotGrid API response types */

export interface Tile {
  x: number;
  y: number;
  owner_name: string;
  display_name?: string;
  color_hex?: string;
  link_url?: string;
  claimed_at?: string;
}

export interface TileChunk {
  tiles: Tile[];
  bounds: { x: number; y: number; w: number; h: number };
}

export interface Stats {
  claimed: number;
  available: number;
  bots: number;
  total_tiles: number;
}

export interface Pricing {
  usd_per_tile: number;
  min_purchase_tiles: number;
  max_purchase_tiles: number;
  grid_size: number;
  total_tiles: number;
  supported_payment_methods: string[];
  pricing_model: string;
}

export interface Challenge {
  status: string;
  bot_name: string;
  challenge_id: string;
  layers_required: number;
  base_digest: string;
  layer_salts: string[];
  algorithm: string;
}

export interface RegistrationResult {
  status: string;
  bot_name: string;
  api_key: string;
  key_prefix: string;
  message: string;
  next_steps: string[];
}

export interface CheckoutResult {
  checkout_url?: string;
  session_id?: string;
  payment_request?: Record<string, unknown>;
}
