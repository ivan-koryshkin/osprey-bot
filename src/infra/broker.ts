import { Redis } from "ioredis";

let broker: Redis | undefined = undefined;


export function getBroker() : Redis {
    if(!broker) {
        broker = new Redis({password: process.env.REDIS_PASS})
    }
    return broker
}