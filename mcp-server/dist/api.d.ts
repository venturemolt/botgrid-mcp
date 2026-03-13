/** BotGrid API client — v2 anti-captcha verification system */
export declare class BotGridAPI {
    private baseUrl;
    private apiKey?;
    constructor(baseUrl?: string, apiKey?: string);
    private request;
    getPricing(): Promise<unknown>;
    getStats(): Promise<unknown>;
    getTos(): Promise<unknown>;
    getPrivacy(): Promise<unknown>;
    getTiles(): Promise<unknown>;
    getTileChunk(x: number, y: number, w: number, h: number): Promise<unknown>;
    getTileDetail(x: number, y: number): Promise<unknown>;
    getRecentEvents(): Promise<unknown>;
    verifyChallenge(botId: string, reservationId?: string): Promise<unknown>;
    verifyPrecisionPulse(challengeId: string): Promise<unknown>;
    verifyEphemeralConsume(challengeId: string, pathToken: string): Promise<unknown>;
    verifyComplete(challengeId: string, submitToken: string, botId: string, challengeSignature: string, layerResults: Array<{
        layer_name: string;
        payload: Record<string, unknown>;
    }>): Promise<unknown>;
    checkout(params: {
        bot_name: string;
        display_name: string;
        tiles: Array<{
            x: number;
            y: number;
        }>;
        color: string;
        link?: string;
        bot_contact?: string;
    }): Promise<unknown>;
    checkoutSolana(params: {
        bot_name: string;
        display_name: string;
        tiles: Array<{
            x: number;
            y: number;
        }>;
        color: string;
    }): Promise<unknown>;
    confirmSolana(txSignature: string, sessionId: string): Promise<unknown>;
    getBattlegridEligibility(): Promise<unknown>;
    rotateKey(): Promise<unknown>;
    customizeTile(x: number, y: number, updates: {
        display_name?: string;
        color_hex?: string;
        link_url?: string;
    }): Promise<unknown>;
}
//# sourceMappingURL=api.d.ts.map