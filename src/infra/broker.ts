import { Redis } from "ioredis";

let broker: Redis | undefined = undefined;


export function getBroker() : Redis {
    if(!broker) {
        broker = new Redis({password: process.env.REDIS_PASS, host: process.env.REDIS_HOST})
    }
    return broker
}