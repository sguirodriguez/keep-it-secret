import crypto from 'crypto'

function stableStringify(obj: unknown): string {
    if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
    const sorted = (value: any): any => {
        if (value === null || typeof value !== 'object') return value;
        if (Array.isArray(value)) return value.map(sorted);
        return Object.keys(value)
            .sort()
            .reduce((acc: Record<string, any>, key) => {
                acc[key] = sorted(value[key]);
                return acc;
            }, {});
    };
    return JSON.stringify(sorted(obj));
}

function canonicalString(req: any, timestamp: string, nonce: string | undefined): string {
    const method = (req.method || '').toUpperCase();
    const pathWithQuery = req.raw?.url || req.url || '';
    const bodyStr =
        typeof (req as any).rawBody === 'string'
            ? (req as any).rawBody
            : req.body
                ? stableStringify(req.body)
                : '';
    const nonceVal = nonce ?? '';
    return [timestamp, nonceVal, method, pathWithQuery, bodyStr].join('\n');
}

function parseTimestampMs(tsHeader: string): number | null {
    if (!tsHeader) return null;
    if (/^\d+$/.test(tsHeader)) {
        const num = Number(tsHeader);
        if (!Number.isFinite(num)) return null;
        // Assume ms if >= 10^11, else seconds
        return num >= 1e11 ? num : num * 1000;
    }
    const dt = Date.parse(tsHeader);
    return Number.isFinite(dt) ? dt : null;
}

function getClientIp(req: any): string {
    const xfwd = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim();
    return xfwd || (req.ip as string) || '';
}

function ipAllowed(ip: string, allowedList: string[] | null | undefined): boolean {
    if (!allowedList || allowedList.length === 0) return true;
    if (!ip) return false;
    for (const rule of allowedList) {
        const trimmed = (rule || '').trim();
        if (!trimmed) continue;
        if (trimmed === '*') return true;
        if (trimmed.endsWith('.*')) {
            const prefix = trimmed.slice(0, -2);
            if (ip.startsWith(prefix + '.')) return true;
        }
        if (trimmed === ip) return true;
    }
    return false;
}

function hasAllScopes(keyScopes: string[] | null | undefined, required: string[] | undefined): boolean {
    if (!required || required.length === 0) return true;
    const present = new Set((keyScopes ?? []).map((s) => s.toLowerCase()));
    return required.every((s) => present.has(s.toLowerCase()));
}

function constantTimeEqualHex(a: string, b: string): boolean {
    try {
        const aBuf = Buffer.from(a, 'hex');
        const bBuf = Buffer.from(b, 'hex');
        if (aBuf.length !== bBuf.length) return false;
        return crypto.timingSafeEqual(aBuf, bBuf);
    } catch {
        return false;
    }
}


export { canonicalString, parseTimestampMs, getClientIp, ipAllowed, hasAllScopes, constantTimeEqualHex }