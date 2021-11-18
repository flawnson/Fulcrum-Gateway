// @ts-nocheck
// import dbStuff from '../../db/

export default async function (organizerID: number, queueID: number) {
    try {
        // Get the queue data from either redis or the database as an object
        const queueData = await getQueueData(queueID, organizerID)
        return queueData.enqueued
    } catch(e) {
        throw new Error(e.message)
    }
}
