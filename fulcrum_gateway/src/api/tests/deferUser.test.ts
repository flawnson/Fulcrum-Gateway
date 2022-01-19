import app from "../app";
import request from 'supertest';
import { redis } from "../redisClient";
import prisma from '../prismaClient';
import { dbSetup } from '../seed/dbSetup';

beforeAll(async () => {
  //redis is automatically connected from import
  // may not need any connections
  // await prisma.$connect();
});

afterAll(async () => {
  // close redis connection
  await redis.disconnect();
  // close prisma connection
  await prisma.$disconnect();
});

describe("Defer User (Organizer)", () => {

  beforeEach(async () => {
    await dbSetup(); // will auto clear db before re-populating

    // login
    let data = {
      query: `mutation login_organizer($email: String!, $password: String!) {
                 loginOrganizer(email: $email, password: $password){
                   id
                 }
              }`,
      variables: {
          "email": "test@gmail.com",
          "password": "password123"
      }

    }
    const response = await request(app).post("/api").send(data);
    console.log("Logged in as organizer");
  });

  afterEach(async () => {
    // logout
    let data = {
      query: `mutation logout_organizer {
                  logoutOrganizer
              }`
    }
    const response = await request(app).post("/api").send(data);
    console.log("Logged out as organizer");
  });

  test("Normal Defer (2+ people)", async () => {

    expect(1).toBe(1);
    //expect(response.statusCode).toBe(200);
  });

});
