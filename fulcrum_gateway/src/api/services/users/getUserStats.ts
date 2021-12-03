import getETA from './getETA';
import getWaitedTime from './getWaitedTime';
import getAverageWait from './getAverageWait';
import getQueuerIndex from './getUserIndex';

export default async function (queuerId: number) {
    try {
        const eta = await getETA(queuerId)
        const avg = await getAverageWait(queuerId)
        const wait = await getWaitedTime(queuerId)
        const index = await getQueuerIndex(queuerId)
        return {eta: eta, avg: avg, wait: wait, index: index}
    } catch(e) {
        throw new Error(e.message)
    }
}
