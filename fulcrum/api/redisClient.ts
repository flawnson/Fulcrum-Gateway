// redis module
// import { createClient } from 'redis';
// export const redis = createClient();

import Redis from "ioredis";
export const redis = new Redis();
