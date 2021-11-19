// @ts-nocheck
// Used by queuer and organizer services to get queue data

export default async function (queueID: number, organizerID?: number) {
    if (typeof organizerID != "undefined") {
        // Fetch queue data for queuer
        try {
            const queueData = null
            return null
        } catch (e) {
            throw new Error(e.message)
        }
    } else {
        // Fetch queue data for organizer
        try {
            const queueData = null
            return null
        } catch (e) {
            throw new Error(e.message)
        }
    }
}
