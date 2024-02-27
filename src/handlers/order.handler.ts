import { Context } from 'telegraf';
import { Update } from "@telegraf/types"
import { getWebAppData } from './common.handlers';
import { OrderService } from "../services/order.service";
import { CustomerSyncResponse, OrderItemCreateResponse, OrderCreateResponse, OrderConfirmationMessage } from "../types"
import { unconfirmedOrder, confirmedOrder } from "../messages/order.message"


export async function onOrderCreate(
    ctx: Context<Update.MessageUpdate>,
    customer: CustomerSyncResponse
) : Promise<string>{
    const webdata = await getWebAppData(ctx)
    const service = new OrderService(customer.externalId, customer)
    const order = await service.proccessOrder(webdata)
    return await unconfirmedOrder(order)
}

export async function onOrderConfirmDelivery(
    ctx: Context<Update.MessageUpdate>
) : Promise<string|null> {
    const service = new OrderService(ctx.from.id.toString())
    const status = await service.confirmOrderDelivery(
        ctx.message['location']['longtitude'],
        ctx.message['location']['latitude']
    )
    if(status) {
        const order = await service.lastConfirmed(ctx.from.id.toString())
        return await confirmedOrder(order)
    }
    return null
}

export async function onOrderConfirmPickup(
    ctx: Context<Update.CallbackQueryUpdate>, delay?: number
) : Promise<string|null> {
    const service = new OrderService(ctx.from.id.toString())
    const status = await service.confirmOrderPickup(delay)
    if(status) {
        const order = await service.lastConfirmed(ctx.from.id.toString())
        return await confirmedOrder(order)
    }
    return null
}