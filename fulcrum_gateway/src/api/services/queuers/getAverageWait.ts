// @ts-nocheck
// import dbStuff from '../../db/
import getQueueID from "../queues/getQueueID";
import getQueueData from "../queues/getQueueData";

export default async function (queuerID: number) {
    try {
        // Get the queueID from the gueuerID
        const queueID = await getQueueID(queuerID)
        // Get the queue data from either redis or the database as an object
        const queueData = await getQueueData(queueID)
        // Index into the queue data object to get the sum of the waited times
        const sum = queueData.userWaitedTimes.reduce((a: number, b: number) => a + b, 0)
        // Divide by the number of queuers to get the average
        return sum / queueData.userWaitedTimes.length()
    } catch(e) {
        throw new Error(e.message)
    }
}
