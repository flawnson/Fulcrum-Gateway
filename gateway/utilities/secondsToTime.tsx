export default function (seconds: number) {
    return new Date(seconds * 1000).toISOString().substring(14, 14 + 5)
}
