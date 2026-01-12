import crypto from 'crypto';

function computeSignature(secret: string, payload: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function computeSignatureWithHexKey(hexKey: string, payload: string): string {
    const key = Buffer.from(hexKey, 'hex');
    return crypto.createHmac('sha256', key).update(payload).digest('hex');
}

export {
    computeSignature,
    computeSignatureWithHexKey
}