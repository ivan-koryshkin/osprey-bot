import { Context } from 'telegraf';
import { Update } from "@telegraf/types"
import { getWebAppData } from './common.handlers';
import { OrderService } from "../services/order.service";
import { CustomerSyncResponse, OrderItemCreateResponse, OrderCreateResponse, OrderConfirmationMessage } from "../types"


export async function onOrderCreate(
    ctx: Context<Update.MessageUpdate>,
    customer: CustomerSyncResponse
) : Promise<OrderCreateResponse|null>{
    const webdata = await getWebAppData(ctx);
    const service = new OrderService(customer.externalId, customer);
    const order = await service.proccessOrder(webdata);
    return order;
}

export async function onOrderConfirmDelivery(
    ctx: Context<Update.MessageUpdate>
) : Promise<OrderCreateResponse|null> {
    const service = new OrderService(ctx.from.id.toString())
    const status = await service.confirmOrderDelivery(
        ctx.message['location']['longitude'],
        ctx.message['location']['latitude']
    )
    if(status) {
        const order = await service.lastConfirmed(ctx.from.id.toString())
        return order;
    }
    return null
}

export async function onOrderConfirmPickup(
    ctx: Context<Update.CallbackQueryUpdate>, delay?: number
) : Promise<OrderCreateResponse|null> {
    const service = new OrderService(ctx.from.id.toString())
    const status = await service.confirmOrderPickup(delay)
    if(status) {
        const order = await service.lastConfirmed(ctx.from.id.toString())
        return order
    }
    return null
}