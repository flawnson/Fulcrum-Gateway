import rateLimit from 'express-rate-limit';
import { errors } from "../constants";

export const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  max: 10000, //20000 request allowed (to take into account for polling)
  message: {
    error: errors.REQUEST_LIMIT_EXCEEDED
  },
  headers: true,
});
