import { Context } from 'telegraf';
import { Update } from "@telegraf/types"
import { HUB_URI } from '../const'
import { Service } from './base.service'
import { CustomerSyncResponse } from '../types';

const debug = process.env.DEBUG

export class UserService extends Service {
    constructor() {
        super('user')
    }

    async sync(ctx: Context<Update.MessageUpdate>): Promise<CustomerSyncResponse|null> {
        const url = `${HUB_URI}/customer/sync`
        try{
            const result = await this.post(url, {
                externalId: ctx.from.id.toString(),
                firstName: ctx.from.first_name,
                lastName: ctx.from.last_name,
                username: ctx.from.username,
                blocked: false
            })
            if(debug) { this.debug(result.status, 'sync') }
            return (await result.json()) as CustomerSyncResponse
        } catch (e: any) {
            console.error({
                name: 'Customer syncronization',
                error: e
            })
            return null
        }
    }
}