import { Context } from 'telegraf';
import { Update } from "@telegraf/types"
import { UserService } from "../services/user.service";
import { CustomerSyncResponse } from '../types';

export async function onUserSync(ctx: Context<Update.MessageUpdate>) : Promise<CustomerSyncResponse|null>{
    const service = new UserService()
    return await service.sync(ctx)
}