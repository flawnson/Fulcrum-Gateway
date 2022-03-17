// @ts-nocheck for express and router redeclaration error
const fetch = require('node-fetch')
export {}  // Empty export to bypass --IsolatedModules error
const express = require('express');
const router = express.Router();


router.get('/user', async (req, res, next) => {
    console.log('triggered')
    const query = `
        query get_user_stats {
            getUser {
                ... on User {
                    id
                    phone_number
                    name
                    index
                    status
                    estimated_wait
                    join_time
                    summoned
                    queue {
                        name
                        state
                        average_wait
                    }
                }
                ... on Error {
                    error
                }
            }
        }
    `

    try {
        await fetch("http://localhost:8080/api", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "https://api.fiefoe.com/api",
            },
            credentials: 'include',
            body: JSON.stringify({query: query})
        }).then(data => {
            console.log(data)
            res.send(data)
        })
    } catch (error) {
        console.log(error)
    }

})

// router.post('/organizer/:organizerId/queues/:queueId/:queuerId/kick', queue_controller.kick_enqueued)

module.exports = router
export const router
