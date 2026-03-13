/** BotGrid API client */
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
    // ── Registration (no auth) ──
    async register(botName) {
        return this.request("POST", "/api/register", { bot_name: botName });
    }
    async registerComplete(challengeId, botName, layerProofs) {
        return this.request("POST", "/api/register/complete", {
            challenge_id: challengeId,
            bot_name: botName,
            layer_proofs: layerProofs,
        });
    }
    // ── Auth required ──
    async challengeRequest() {
        return this.request("POST", "/api/challenge/request", undefined, true);
    }
    async challengeSubmit(challengeId, proof) {
        return this.request("POST", `/api/challenge/${challengeId}/submit`, { proof }, true);
    }
    async challengeStatus(challengeId) {
        return this.request("GET", `/api/challenge/${challengeId}/status`, undefined, true);
    }
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