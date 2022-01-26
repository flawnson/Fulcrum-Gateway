// redis module
// import { createClient } from 'redis';
// export const redis = createClient();

import Redis from "ioredis";
//export const redis = new Redis(process.env.REDIS_URL);
console.log("Connecting to Redis at port " + process.env.REDIS_PORT + " and ip " + process.env.REDIS_IP);
export const redis = new Redis(Number(String(process.env.REDIS_PORT)), process.env.REDIS_IP);
