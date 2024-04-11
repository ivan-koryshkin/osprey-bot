import { Telegraf, Markup } from "telegraf";
import { onOrderConfirmDelivery, onOrderConfirmPickup, onOrderCreate } from "./handlers/order.handler";
import { onUserSync } from "./handlers/user.handler";
import { IsLocation, IsWebAppData } from "./handlers/common.handlers";
import { Context } from "telegraf";
import { Update } from "@telegraf/types";
import { DELAY_DEFAULT } from "./const";
import { getBroker } from "./infra/broker"
import { MqMessage, BrokerChannelResponse } from "./types"
import { ChannelService } from "./services/channel.service";
import { OrderMessageI18n } from './messages/order.message';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
const appUrl = process.env.API_URL;
const broker = getBroker();

const channelService = new ChannelService();
channelService.requestChannel().then((initInfo: BrokerChannelResponse) => {
  console.log(initInfo)
  broker.subscribe(initInfo.id);
  broker.on('message', (ch: string, msg: string) => {
    try {
      console.log(msg)
      const payload = JSON.parse(msg) as MqMessage
      if(payload.type === 'feedback') {
        bot.telegram.sendMessage(payload.userId, payload.message)
      }
    } catch(e: any) {
      console.error({channel: ch, message: msg, error: e})
    }
  })
})


bot.command("start", (ctx) => {
  const url = `${appUrl}?userId=${ctx.from.id}`
  console.log({chat: ctx.chat.id, user: ctx.message.from.id})
  return ctx.reply("Open Menu", Markup.keyboard([Markup.button.webApp("Open", url),]).resize());
});

bot.on('message', async (ctx: Context<Update.MessageUpdate>) => {
  const orderI18n = new OrderMessageI18n(ctx.from.language_code);
  if(IsWebAppData(ctx)) {
    const customer = await onUserSync(ctx);
    if(customer !== null) {
      try {
        const inlineKeyboard = Markup.inlineKeyboard([
          Markup.button.callback(orderI18n.dineIn(), 'order_pickup'),
          Markup.button.callback(orderI18n.takeAway(), 'order_pickup_delay_20'),
        ]).reply_markup;
        const order = await onOrderCreate(ctx, customer);
        if(!order) { new Error('cant create order') }
        const msg = orderI18n.unconfirmed(order);
        ctx.reply(msg, { parse_mode: 'HTML', reply_markup: inlineKeyboard })
      } catch(e) {
          console.error(e)
          ctx.sendMessage('Oops something went wrong, try later :(')
      }
    }
  } else if(IsLocation(ctx)) {
    const order = await onOrderConfirmDelivery(ctx);
    if(order === null) { 
      const msg = orderI18n.noActiveOrders();
      ctx.reply(msg);
    } else {
      const msg = orderI18n.confirmed(order);
      await ctx.reply(msg, {parse_mode: 'HTML'});
    }
  }
})

bot.action('order_pickup', async (ctx: Context<Update.CallbackQueryUpdate>) => {
  ctx.answerCbQuery('👍');
  const order = await onOrderConfirmPickup(ctx);
  const orderI18n = new OrderMessageI18n(ctx.from.language_code);
  let message = '';
  if(order === null) {
    message = orderI18n.noActiveOrders();
    ctx.reply(message);
  } 
  else {
    message = orderI18n.confirmed(order);
    ctx.reply(message, {parse_mode: 'HTML'});
  }
});

bot.action('order_pickup_delay_20', async (ctx: Context<Update.CallbackQueryUpdate>) => {
  ctx.answerCbQuery('👍');
  const orderI18n = new OrderMessageI18n(ctx.from.language_code);
  const order = await onOrderConfirmPickup(ctx, DELAY_DEFAULT);
  if(order === null) {
    const message = orderI18n.noActiveOrders();
    ctx.reply(message) 
  }
  else {
    const message = orderI18n.confirmed(order);
    ctx.reply(message, {parse_mode: 'HTML'}) 
  }
})
console.log('bot started')
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))