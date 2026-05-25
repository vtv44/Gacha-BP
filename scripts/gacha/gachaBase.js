export class gachaBase {
    lottery(max) {
        // AI code しんじるな
        const maxUint32 = 0xFFFFFFFF
        const limit = maxUint32 - (maxUint32 % max)

        const buf = new Uint32Array(1)

        while (true) {
            crypto.getRandomValues(buf)

            const value = buf[0]

            if (value < limit) {
                return value % max
            }
        }
    }
}