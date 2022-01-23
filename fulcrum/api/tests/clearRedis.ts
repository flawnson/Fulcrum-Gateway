import { redis } from "../redisClient";

export async function clearRedis(){
  // clear all redis keys related to confirmation, email, and sms
  const keys = await redis.keys('*');
  var pipeline = redis.pipeline();
  keys.forEach(function (key) {
    pipeline.del(key);
  });
  pipeline.exec();

}
