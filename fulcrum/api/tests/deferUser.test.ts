// var session = require('supertest-session');
import app from "../app";
import request from 'supertest';
import { redis } from "../redisClient";
import prisma from '../prismaClient';
import { dbSetup } from '../seed/dbSetup';
import { clearRedis } from './clearRedis';
import { QueueState, UserStatus } from "@prisma/client";

// let authenticatedSession: any = null;

let agent = request.agent(app);


beforeAll(async () => {
  //redis is automatically connected from import
  // may not need any connections
  // await prisma.$connect();
});

afterAll(async () => {
  // close redis connection
  await redis.disconnect();
  await redis.quit();
  // close prisma connection
  await prisma.$disconnect();
});

// Organizer Defer
describe("Defer User (Organizer)", () => {


  // login as organizer
  beforeEach(async () => {
    const email = "test@gmail.com";
    const password = "password123";

    let data = {
      query: `mutation login_organizer($email: String!, $password: String!) {
                loginOrganizer(email: $email, password: $password){
                    ... on Organizer {
                        id
                    }
                    ... on Error {
                        error
                    }
                }
              }`,
      variables: {
          "email": email,
          "password": password
      }

    }

    await dbSetup(); // will auto clear db before re-populating
    const response = await agent.post("/api").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toHaveProperty("errors");
    //console.log("Logged in as organizer");
  });

  afterEach(async () => {
    // logout
    let data = {
      query: `mutation logout_organizer {
                  logoutOrganizer
              }`
    }
    const response = await agent.post("/api").send(data);
    //console.log("Logged out as organizer");
  });

  test("Index Defer (Normal)", async () => {
    const userId = "user13";
    const numSpots = 1;
    let data = {
      query: `mutation defer_user($userId: String, $numSpots: Int!) {
                  indexDeferPosition(userId: $userId, numSpots: $numSpots){
                      ... on User {
                          id
                          index
                      }
                      ... on Error {
                          error
                      }
                  }
              }`,
      variables: {
        "userId": userId,
        "numSpots": numSpots
      }
    }
    // const response = await authenticatedSession.post("/api").send(data);
    const response = await agent.post("/api").send(data);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toHaveProperty("errors");

    // check the queue's new order
    // get list of enqueued users in ascending order of index
    const userToDefer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        queue: {
          include: {
            users: {
              where: {
                index: {
                  gt: 0
                }
              },
              orderBy: {
                index: 'asc',
              },
              select: {
                id: true,
                index: true
              }
            }
          }
        }
      }
    });

    expect(userToDefer).not.toBeFalsy(); // cannot return null

    const correctOrder = [
      {
        id: "user14",
        index: 1
      },
      {
        id: "user13",
        index: 2
      },
      {
        id: "user15",
        index: 3
      }
    ];

    const returnedOrder = userToDefer!.queue.users;

    expect(returnedOrder).toStrictEqual(correctOrder);

  });

  test("Index Defer (Last person in queue)", async () => {
    const userId = "user15";
    const numSpots = 1;
    let data = {
      query: `mutation defer_user($userId: String, $numSpots: Int!) {
                  indexDeferPosition(userId: $userId, numSpots: $numSpots){
                      ... on User {
                          id
                          index
                      }
                      ... on Error {
                          error
                      }
                  }
              }`,
      variables: {
        "userId": userId,
        "numSpots": numSpots
      }
    }
    // const response = await authenticatedSession.post("/api").send(data);
    const response = await agent.post("/api").send(data);

    //console.log(response);
    expect(response.statusCode).toBe(200);

    // check the queue's new order
    // get list of enqueued users in ascending order of index
    const userToDefer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        queue: {
          include: {
            users: {
              where: {
                index: {
                  gt: 0
                }
              },
              orderBy: {
                index: 'asc',
              },
              select: {
                id: true,
                index: true
              }
            }
          }
        }
      }
    });

    expect(userToDefer).not.toBeFalsy(); // cannot return null

    const correctOrder = [
      {
        id: "user13",
        index: 1
      },
      {
        id: "user14",
        index: 2
      },
      {
        id: "user15",
        index: 3
      }
    ];

    const returnedOrder = userToDefer!.queue.users;

    expect(returnedOrder).toStrictEqual(correctOrder);

  });

  test("Index Defer (Only person in queue)", async () => {
    const userId = "user16";
    const numSpots = 1;
    let data = {
      query: `mutation defer_user($userId: String, $numSpots: Int!) {
                  indexDeferPosition(userId: $userId, numSpots: $numSpots){
                      ... on User {
                          id
                          index
                      }
                      ... on Error {
                          error
                      }
                  }
              }`,
      variables: {
        "userId": userId,
        "numSpots": numSpots
      }
    }
    // const response = await authenticatedSession.post("/api").send(data);
    const response = await agent.post("/api").send(data);

    //console.log(response);
    expect(response.statusCode).toBe(200);

    // check the queue's new order
    // get list of enqueued users in ascending order of index
    const userToDefer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        queue: {
          include: {
            users: {
              where: {
                index: {
                  gt: 0
                }
              },
              orderBy: {
                index: 'asc',
              },
              select: {
                id: true,
                index: true
              }
            }
          }
        }
      }
    });

    expect(userToDefer).not.toBeFalsy(); // cannot return null

    const correctOrder = [
      {
        id: "user16",
        index: 1
      }
    ];

    const returnedOrder = userToDefer!.queue.users;

    expect(returnedOrder).toStrictEqual(correctOrder);

  });

});



// DEFER USER (USER)
async function createAndConfirmUser(variables: object){
  const query = `mutation join_queue($joinCode: String!, $phoneNumber: String!, $name: String!) {
                      joinQueue(joinCode: $joinCode, phoneNumber: $phoneNumber, name: $name){
                          ... on User {
                              id
                          }
                          ... on Error {
                              error
                          }
                      }
                  }`;

  let data = {
    query: query,
    variables: variables
  }

  const confirmQuery = `mutation confirm_user($confirmCode: String!) {
                          confirmUser(confirmCode: $confirmCode){
                              ... on User {
                                id
                              }
                              ... on Error {
                                error
                              }
                          }
                        }`;


  const response = await agent.post("/api").send(data);



  const keys = await redis.keys('user-confirmation:*');
  for (let i = 0; i < keys.length; i++){
    const confirmCode = keys[i].split(":")[1];
    // call confirmation request to confirm user
    const confirmVariables = {
      "confirmCode": confirmCode
    };
    let data = {
      query: confirmQuery,
      variables: confirmVariables
    };

    const response = await agent.post("/api").send(data);
  }
}

describe("Defer User (User)", () => {
  beforeEach(async () => {
    await clearRedis();
    await dbSetup(); // will auto clear db before re-populating
    const variables = {
        "joinCode": "a4e35t",
        "name": "Max123",
        "phoneNumber": "134444452"
    }
    await createAndConfirmUser(variables);

  });

  afterEach(async () => {
    // nothing for now
  });

  test("Index Defer (Normal)", async () => {
    // add another user behind them
    const testDate = new Date()
    await prisma.user.create({
      data: {
        id: "after_max",
        name: "After Max",
        queue_id: "costco_queue3",
        summoned: false,
        phone_number: "9765890001",
        party_size: 1,
        last_online: testDate,
        index: 5,
        join_time: testDate,
        status: UserStatus.ENQUEUED
      }
    })

    let data = {
      query: `mutation defer_user($numSpots: Int!) {
                  indexDeferPosition(numSpots: $numSpots){
                      ... on User {
                          id
                      }
                      ... on Error {
                          error
                      }
                  }
              }`,
      variables: {
          "numSpots": 1
      }
    }
    // const response = await authenticatedSession.post("/api").send(data);
    const response = await agent.post("/api").send(data);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toHaveProperty("errors");

    // check the queue's new order
    // get list of enqueued users in ascending order of index
    const userId = response.body["data"]["indexDeferPosition"]["id"];
    const userToDefer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        queue: {
          include: {
            users: {
              where: {
                index: {
                  gt: 0
                }
              },
              orderBy: {
                index: 'asc',
              },
              select: {
                name: true,
                index: true
              }
            }
          }
        }
      }
    });

    expect(userToDefer).not.toBeFalsy(); // cannot return null

    const correctOrder = [
      {
        name: "B",
        index: 1
      },
      {
        name: "C",
        index: 2
      },
      {
        name: "D",
        index: 3
      },
      {
        name: "After Max",
        index: 4
      },
      {
        name: "Max123",
        index: 5
      }
    ];

    const returnedOrder = userToDefer!.queue.users;

    expect(returnedOrder).toStrictEqual(correctOrder);
  });

  test("Index Defer (Last person in queue)", async () => {
    let data = {
      query: `mutation defer_user($numSpots: Int!) {
                  indexDeferPosition(numSpots: $numSpots){
                      ... on User {
                          id
                      }
                      ... on Error {
                          error
                      }
                  }
              }`,
      variables: {
          "numSpots": 1
      }
    }
    // const response = await authenticatedSession.post("/api").send(data);
    const response = await agent.post("/api").send(data);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toHaveProperty("errors");

    // check the queue's new order
    // get list of enqueued users in ascending order of index
    const userId = response.body["data"]["indexDeferPosition"]["id"];
    const userToDefer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        queue: {
          include: {
            users: {
              where: {
                index: {
                  gt: 0
                }
              },
              orderBy: {
                index: 'asc',
              },
              select: {
                name: true,
                index: true
              }
            }
          }
        }
      }
    });

    expect(userToDefer).not.toBeFalsy(); // cannot return null

    const correctOrder = [
      {
        name: "B",
        index: 1
      },
      {
        name: "C",
        index: 2
      },
      {
        name: "D",
        index: 3
      },
      {
        name: "Max123",
        index: 4
      }
    ];

    const returnedOrder = userToDefer!.queue.users;

    expect(returnedOrder).toStrictEqual(correctOrder);
  });

  test("Index Defer (Only person in queue)", async () => {

    // create user in a different queue
    const variables = {
        "joinCode": "678iuy",
        "name": "Sack of Potatoes",
        "phoneNumber": "4356752"
    }
    await createAndConfirmUser(variables);

    let data = {
      query: `mutation defer_user($numSpots: Int!) {
                  indexDeferPosition(numSpots: $numSpots){
                      ... on User {
                          id
                      }
                      ... on Error {
                          error
                      }
                  }
              }`,
      variables: {
          "numSpots": 1
      }
    }
    // const response = await authenticatedSession.post("/api").send(data);
    const response = await agent.post("/api").send(data);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toHaveProperty("errors");

    // check the queue's new order
    // get list of enqueued users in ascending order of index
    const userId = response.body["data"]["indexDeferPosition"]["id"];
    const userToDefer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        queue: {
          include: {
            users: {
              where: {
                index: {
                  gt: 0
                }
              },
              orderBy: {
                index: 'asc',
              },
              select: {
                name: true,
                index: true
              }
            }
          }
        }
      }
    });

    expect(userToDefer).not.toBeFalsy(); // cannot return null

    const correctOrder = [
      {
        name: "Sack of Potatoes",
        index: 1
      }
    ];

    const returnedOrder = userToDefer!.queue.users;

    expect(returnedOrder).toStrictEqual(correctOrder);
  });
});
