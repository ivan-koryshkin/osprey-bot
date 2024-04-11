import { OrderConfirmationMessage, OrderCreateResponse, OrderItemCreateResponse } from "../types"
import { TMPL_ORDER_UNCONFIRMED, TMPL_ORDER_CONFIRMED, TMPL_ORDER_DONE, TMPL_NO_ACTIVE_ORDERS } from '../const';

import { I18n } from './i18n.message';

function calcTotal(order: OrderCreateResponse) : number {
    const prices = order.items.map((o: OrderItemCreateResponse) => {
        return +o.count * o.product.price 
    })
    return prices.reduce((subTotal: number, itemPrice: number) => {
        return subTotal + itemPrice
    }, 0)
}


export class OrderMessageI18n extends I18n {
    private default_msg_dine_in = "Dine in"
    private default_msg_dine_in_ru = "В заведении"
    private default_msg_takeaway = "Takeaway in 20 min";
    private default_msg_takeaway_ru = "Заберу через 20 мин"
    unconfirmed(order: OrderCreateResponse) : string {
        const orderCtx: OrderConfirmationMessage = {...order, total: calcTotal(order)};
        return this.render(TMPL_ORDER_UNCONFIRMED, orderCtx);
    }
    
    confirmed(order: OrderCreateResponse) : string {
        const orderCtx: OrderConfirmationMessage = {...order, total: calcTotal(order)}
        return this.render(TMPL_ORDER_CONFIRMED, orderCtx);
    }

    done() : string {
        return this.render(TMPL_ORDER_DONE)
    }

    noActiveOrders() : string {
        return this.render(TMPL_NO_ACTIVE_ORDERS)
    }

    dineIn() : string {
        return this.code === 'ru' ? this.default_msg_dine_in_ru : this.default_msg_dine_in;
    }

    takeAway() : string {
        return this.code === 'ru' ? this.default_msg_takeaway_ru : this.default_msg_takeaway;
    }
}