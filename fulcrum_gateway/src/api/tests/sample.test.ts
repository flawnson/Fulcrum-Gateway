import app from "../app";
import request from 'supertest';
import { redis } from "../redisClient";
import prisma from '../prismaClient';


beforeAll(async () => {
  await prisma.$connect();
  // clear all current data first
  await prisma.user.deleteMany({});
  await prisma.queue.deleteMany({});
  await prisma.organizer.deleteMany({});

});

describe("Sample test", () => {
  it("Organizer Login", async () => {
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
    const response = await request(app).post("/api").send(data)
    //console.log(response);
    expect(response.statusCode).toBe(200);
  });
});

afterAll(async () => {
  // close redis connection
  await redis.disconnect();
  // close prisma connection
  await prisma.$disconnect();
});
