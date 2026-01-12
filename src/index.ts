import 'dotenv/config'
import { computeSignature } from './factories/signature'

const payload = {
    name: "Samuel",
    type: "PAYMENT",
    date: Date.now()
}

console.log("payload", payload)

const signatureSHA256 = computeSignature(process.env.SECRET_KEY!, JSON.stringify(payload))

console.log("signatureSHA256", signatureSHA256)