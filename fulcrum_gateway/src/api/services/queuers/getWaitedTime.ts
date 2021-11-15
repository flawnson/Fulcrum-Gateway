// @ts-nocheck
// Each person's waited time is calculated by the moment they join the line to the moment they are summoned

export default async function (queuerId: number) {
    try {
        // Get the queueID from the gueuerID
        const queueID = await getQueueID(queuerID)
        // Get the queue data from either redis or the database as an object
        const queueData = await getQueueData(queueID)
        // Get current time and date
        const now = new Date()
        // Difference between join time (stored as a string) and now is waited time
        const joinTime = new Date(queueData.joinTime)

        return Math.abs(now - joinTime)
    } catch(e) {
        throw new Error(e.message)
    }
}
