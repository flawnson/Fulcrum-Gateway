// Will also be used in organizer services
import getAverageWait from "./getAverageWait";

export default async function (queuerID: number) {
    try {
        const avgWait = await getAverageWait(queuerID)
    } catch(e) {
        throw new Error(e.message)
    }
}
