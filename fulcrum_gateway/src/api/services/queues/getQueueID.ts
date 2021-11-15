// @ts-nocheck
// Used by queuer services to get the queue ID (this is to validate the queuer ID)

export default async function (queuerID: number) {
    try {
        return queueID
    } catch(e) {
        throw new Error(e.message)
    }
}
