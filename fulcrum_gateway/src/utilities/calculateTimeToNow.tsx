export default function (past_time: string) {
    const now: any = new Date()
    const create: any = new Date(past_time)
    const lifespan = Math.abs(now - create)

    let timeLeft = {d: 0, h: 0, m: 0, s: 0};

    if (lifespan > 0) {
        timeLeft = {
            d: Math.floor(lifespan / (1000 * 60 * 60 * 24)),
            h: Math.floor((lifespan / (1000 * 60 * 60)) % 24),
            m: Math.floor((lifespan / 1000 / 60) % 60),
            s: Math.floor((lifespan / 1000) % 60)
        };
    }

    return timeLeft;
}
