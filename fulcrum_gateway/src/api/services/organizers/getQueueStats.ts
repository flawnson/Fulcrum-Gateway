import getAbandoned from './getAbandoned';
import getAverageWait from './getAverageWait';
import getCustomersServiced from './getCustomersServiced';
import getDeferrals from './getDeferrals';
import getEnqueued from './getEnqueued';
import getNoShows from './getNoShows';

export default async function (queueId: number) {
    try {
        const abandoned = await getAbandoned(queueId);
        const avg = await getAverageWait(queueId);
        const customersServiced = await getCustomersServiced(queueId);
        const deferrals = await getDeferrals(queueId);
        const enq = await getEnqueued(queueId);
        const noShows = await getNoShows(queueId);
        return {
            abandoned: abandoned,
            avg: avg,
            customersServiced: customersServiced,
            deferrals: deferrals,
            enq: enq,
            noShows: noShows
        }
    } catch(e) {
        throw new Error(e.message)
    }
}
