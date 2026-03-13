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
    bounds: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
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
export interface VerifyV2ChallengeLayer {
    name: string;
    kind: string;
    [key: string]: unknown;
}
export interface VerifyV2Challenge {
    challenge_id: string;
    bot_id: string;
    reservation_id?: string;
    issued_at: string;
    expires_at: string;
    required_layers: number;
    layers: VerifyV2ChallengeLayer[];
    challenge_signature: string;
    submit_url: string;
    hints: Record<string, string>;
}
export interface VerifyV2Result {
    verified: boolean;
    challenge_id: string;
    verification_token: string;
    verification_token_expires_at: string;
    verification_token_id: string;
}
export interface CheckoutResult {
    checkout_url?: string;
    session_id?: string;
    payment_request?: Record<string, unknown>;
}
//# sourceMappingURL=types.d.ts.map