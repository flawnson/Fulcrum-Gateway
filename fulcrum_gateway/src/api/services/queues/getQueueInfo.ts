// @ts-nocheck
// import dbStuff from '../../db/

export default async function (queueID) {
    try {
        // Get the queue QR code from the database (probably not redis)
        const queueQR = await getQRCode(queueID)

        return {qrCode: queueQR, idCode: queueID}
    } catch(e) {
        throw new Error(e.message)
    }
}
