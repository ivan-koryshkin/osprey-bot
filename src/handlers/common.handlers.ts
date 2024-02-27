import { Context } from "telegraf"
import { Update } from "@telegraf/types"


export function IsWebAppData(ctx: Context<Update.MessageUpdate>) : boolean {
    return (ctx.update.message as any).web_app_data !== undefined
}

export function IsLocation(ctx: Context<Update.MessageUpdate>) : boolean {
    return ctx.update.message['location'] ? true : false
}

export async function getWebAppData(ctx: Context<Update.MessageUpdate>) : Promise<any | null> {
    const isWebdata = IsWebAppData(ctx)
    if(isWebdata) {
        const webAppData = (ctx.update.message as any).web_app_data
        return webAppData.data
    }
    return null;
}
