import { Context, NarrowedContext } from "telegraf"
import { Update } from "@telegraf/types"

export function onOrderReply(webappData: any) {
    var payload = JSON.parse(webappData);
    var items = payload.cartItems.map(function (item: any) {
        return "".concat(item.name, " (x").concat(item.count, ")")
    });
    var msg = '';
    for (var i in items) {
        msg = msg + `${Number(i)+1}. ${items[i]}\n`
    }
    return msg;
}


export function getWebAppData(ctx: Context<Update.MessageUpdate>) : any | null {
    const webAppData: any | undefined = (ctx.update.message as any).web_app_data
    if(webAppData !== undefined) {
        return webAppData.data
    }
    return null;
}