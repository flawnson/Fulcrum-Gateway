import app from "../app";
import request from 'supertest';
import { redis } from "../redisClient";

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
});
