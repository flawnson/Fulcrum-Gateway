// @ts-nocheck

export default async function (queuerId: number) {
    try {
        // Get the queueID from the gueuerID
        const queueID = await getQueueID(queuerID)
        // Get the queue data from either redis or the database as an object
        const queueData = await getQueueData(queueID)
        // Get the queuer data from the queue data
        const queuerData = queueData.queuerID

        return queuerData.index
    } catch(e) {
        throw new Error(e.message)
    }
}
