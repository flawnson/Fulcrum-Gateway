// @ts-nocheck for express and router redeclaration error
import corsURL from "../middleware/corsURL";
import baseURL from "../middleware/baseURL";

const fetch = require('node-fetch')
const express = require('express');
const router = express.Router();


router.post('/user', async (req, res, next) => {

    const joinQueueQuery = `
        mutation join_queue($joinCode: String!, $phoneNumber: String!, $name: String!) {
            joinQueue(joinCode: $joinCode, phoneNumber: $phoneNumber, name: $name){
                ... on User {
                    id
                }
                ... on Error {
                    error
                }
            }
        }
    `
    const body = {query: joinQueueQuery, variables: {joinCode: req.query.joinCode,
                                                     name: req.query.name,
                                                     phoneNumber: req.query.phoneNumber}}

    try {
        fetch(baseURL(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': corsURL(),
            },
            credentials: 'include',
            body: JSON.stringify(body)  // Directly pass formData as variables
        }).then(response => response.json()).then(data => {
                // If response is valid and returns an id, then set auth context, submit, and navigate to dashboard
                if (!!data.errors?.length) {
                    // Check for errors on response
                } else if (data.data.joinQueue?.error === "QUEUE_DOES_NOT_EXIST") {
                    // Check if user exists on backend
                } else if (data.data.joinQueue?.error === "USER_ALREADY_EXISTS") {
                    // Check if user exists on backend
                } else if (data?.data?.createUser) {
                    // Case if Organizer or Assistant creates user
                } else if (data?.data?.joinQueue.id) {
                }
            }
        )
    } catch(error) {
        console.log(error)
    }
})


router.get('/user', async (req, res, next) => {
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
        await fetch(baseURL(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': corsURL(),
            },
            credentials: 'include',
            body: JSON.stringify({query: query})
        }).then(response => response.json()).then(data => {
            res.json(data)
        })
    } catch(error) {
        console.log(error)
    }

})

// router.post('/organizer/:organizerId/queues/:queueId/:queuerId/kick', queue_controller.kick_enqueued)

module.exports = router
export {}  // Empty export to bypass --IsolatedModules error
export const router
