export default function (seconds: number) {
    if (seconds < 3600) {
        return new Date(seconds * 1000).toISOString().substring(14, 14 + 5)
    } else {
        return new Date(seconds * 1000).toISOString().substring(11, 11 + 8)
    }
}
