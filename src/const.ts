import * as path from 'path';

export const HUB_URI: string = 'https://osprey-hub.ru/api/v1'

export const DELAY_DEFAULT: number = 20


export const ERR_MSG: string = 'Oops something went wrong, try later :('
export const ERR_NO_ACTIVE_ORDERS: string = 'No active orders'

export const TEMPLATES: string = process.env.TEMPLATES;
export const TMPL_ORDER_UNCONFIRMED = path.join(TEMPLATES, 'order-unconfirmed');
export const TMPL_ORDER_CONFIRMED = path.join(TEMPLATES, 'order-confirmed');
export const TMPL_NO_ACTIVE_ORDERS = path.join(TEMPLATES, 'no-active-orders');
export const TMPL_ORDER_DONE = path.join(TEMPLATES, 'order-done');
export const TMPL_LANG_RU = 'ru'
