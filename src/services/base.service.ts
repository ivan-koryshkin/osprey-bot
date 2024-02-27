import { url } from "inspector";

const debug = process.env.DEBUG;

export class Service {
    private token: string
    private logtag: string

    constructor(logtag: string) {
        this.token = process.env.OSPREY_TOKEN
        this.logtag = logtag
    }

    async post(url: string, payload: any) : Promise<Response> {
        return await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'X-Application': this.token
            },
            body: JSON.stringify(payload)
        })
    }

    async get(url: string) : Promise<Response> {
        return await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Application': this.token
            }
        })
    }

    buildTag(postfix: string = "") : string {
        if(postfix === "") {
            return `[http][${this.logtag}]`
        } else {
            return `[http][${this.logtag}-${postfix}]`
        }
    }

    debug(statusCode: number, postfix: string = "") {
        const logtag = this.buildTag(postfix)
        if(debug && statusCode >= 300) {
            console.error(`${logtag} status: ${statusCode}`)
        } else {
            console.log(`${logtag} status: ${statusCode}`)
        }
    }
}