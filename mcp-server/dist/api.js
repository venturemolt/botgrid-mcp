/** BotGrid API client — v2 anti-captcha verification system */
const DEFAULT_BASE_URL = "https://thebotgrid.com";
export class BotGridAPI {
    baseUrl;
    apiKey;
    constructor(baseUrl, apiKey) {
        this.baseUrl = (baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
        this.apiKey = apiKey;
    }
    async request(method, path, body, requireAuth = false) {
        const headers = {
            "Content-Type": "application/json",
        };
        if (requireAuth) {
            if (!this.apiKey) {
                throw new Error("API key required. Set BOTGRID_API_KEY environment variable.");
            }
            headers["Authorization"] = `Bearer ${this.apiKey}`;
        }
        else if (this.apiKey) {
            headers["Authorization"] = `Bearer ${this.apiKey}`;
        }
        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const text = await response.text();
            let detail;
            try {
                const json = JSON.parse(text);
                detail = json.detail || json.error || json.message || text;
            }
            catch {
                detail = text;
            }
            throw new Error(`BotGrid API ${response.status}: ${detail}`);
        }
        return response.json();
    }
    // ── Public endpoints (no auth) ──
    async getPricing() {
        return this.request("GET", "/api/pricing");
    }
    async getStats() {
        return this.request("GET", "/api/stats");
    }
    async getTos() {
        return this.request("GET", "/api/tos");
    }
    async getPrivacy() {
        return this.request("GET", "/api/privacy");
    }
    async getTiles() {
        return this.request("GET", "/api/tiles");
    }
    async getTileChunk(x, y, w, h) {
        return this.request("GET", `/api/tiles/chunk?x=${x}&y=${y}&w=${w}&h=${h}`);
    }
    async getTileDetail(x, y) {
        return this.request("GET", `/api/tile?x=${x}&y=${y}`);
    }
    async getRecentEvents() {
        return this.request("GET", "/api/events/recent");
    }
    // ── Verification v2 (auth required) ──
    async verifyChallenge(botId, reservationId) {
        return this.request("POST", "/api/verify/challenge", {
            bot_id: botId,
            ...(reservationId ? { reservation_id: reservationId } : {}),
        }, true);
    }
    async verifyPrecisionPulse(challengeId) {
        return this.request("POST", `/api/verify/layer/precision/${challengeId}/pulse`, undefined, true);
    }
    async verifyEphemeralConsume(challengeId, pathToken) {
        return this.request("POST", `/api/verify/layer/ephemeral/${challengeId}/${pathToken}`, undefined, true);
    }
    async verifyComplete(challengeId, submitToken, botId, challengeSignature, layerResults) {
        return this.request("POST", `/api/verify/complete/${challengeId}/${submitToken}`, {
            bot_id: botId,
            challenge_id: challengeId,
            challenge_signature: challengeSignature,
            layer_results: layerResults,
        }, true);
    }
    // ── Auth required ──
    async checkout(params) {
        return this.request("POST", "/api/checkout", params, true);
    }
    async checkoutSolana(params) {
        return this.request("POST", "/api/checkout/solana", params, true);
    }
    async confirmSolana(txSignature, sessionId) {
        return this.request("POST", "/api/checkout/solana/confirm", { tx_signature: txSignature, session_id: sessionId }, true);
    }
    async getBattlegridEligibility() {
        return this.request("GET", "/api/battlegrid/eligibility", undefined, true);
    }
    async rotateKey() {
        return this.request("POST", "/api/keys/rotate", undefined, true);
    }
    async customizeTile(x, y, updates) {
        return this.request("POST", "/api/tiles/customize", { x, y, ...updates }, true);
    }
}
//# sourceMappingURL=api.js.map