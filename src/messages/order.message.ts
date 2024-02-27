import * as fs from 'fs'
import * as path from 'path'
import * as mustache from 'mustache';
import { OrderConfirmationMessage, OrderCreateResponse, OrderItemCreateResponse } from "../types"
import { TEMPLATES } from '../const';

const TMPL_ORDER_UNCONFIRMED = path.join(TEMPLATES, 'order-unconfirmed.html')
const TMPL_ORDER_CONFIRMED = path.join(TEMPLATES, 'order-confirmed.html')


function calcTotal(order: OrderCreateResponse) : number {
    const prices = order.items.map((o: OrderItemCreateResponse) => {
        return +o.count * o.product.price 
    })
    return prices.reduce((subTotal: number, itemPrice: number) => {
        return subTotal + itemPrice
    }, 0)
}


export async function unconfirmedOrder(order: OrderCreateResponse) : Promise<string>{
    const orderCtx: OrderConfirmationMessage = {...order, total: calcTotal(order)}
    const htmlTemplate = fs.readFileSync(TMPL_ORDER_UNCONFIRMED).toString()
    try {
        return mustache.render(htmlTemplate, orderCtx)
    } catch(e: any) {
        console.error(e)
        new Error(e)
    }
}

export async function confirmedOrder(order: OrderCreateResponse) : Promise<string> {
    const orderCtx: OrderConfirmationMessage = {...order, total: calcTotal(order)}
    const htmlTemplate = fs.readFileSync(TMPL_ORDER_CONFIRMED).toString()
    try {
        return mustache.render(htmlTemplate, orderCtx)
    } catch(e: any) {
        console.error(e)
        new Error(e)
    }
}