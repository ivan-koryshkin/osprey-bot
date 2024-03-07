import { Telegraf, Markup } from "telegraf"
import { onOrderConfirmDelivery, onOrderConfirmPickup, onOrderCreate } from "./handlers/order.handler"
import { onUserSync } from "./handlers/user.handler"
import { IsLocation, IsWebAppData } from "./handlers/common.handlers"
import { Context } from "telegraf"
import { Update } from "@telegraf/types"
import { DELAY_DEFAULT, ERR_NO_ACTIVE_ORDERS } from "./const"

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
const appUrl = process.env.API_URL

bot.command("start", (ctx) => {
  const url = `${appUrl}?userId=${ctx.from.id}`
  return ctx.reply(
    "Open Menu",
    Markup.keyboard([
      Markup.button.webApp("Open", url),
    ]).resize(),
  );
});

bot.on('message', async (ctx: Context<Update.MessageUpdate>) => {
  if(IsWebAppData(ctx)) {
    const customer = await onUserSync(ctx);
    if(customer !== null) {
      try {
        const msg = await onOrderCreate(ctx, customer);
        const inlineKeyboard = Markup.inlineKeyboard([
          Markup.button.callback('Eat in', 'order_pickup'),
          Markup.button.callback('Pickup 20 min', 'order_pickup_delay_20'),
        ]).reply_markup;
        ctx.reply(msg, { 
          parse_mode: 'HTML',
          reply_markup: inlineKeyboard
        })
      } catch(e) {
          console.error(e)
          ctx.sendMessage('Oops something went wrong, try later :(')
      }
    }
  } else if(IsLocation(ctx)) {
    const message = await onOrderConfirmDelivery(ctx)
    if(message === null) { 
      ctx.reply(ERR_NO_ACTIVE_ORDERS) 
    } else {
      await ctx.reply(message, {parse_mode: 'HTML'})
    }
  }
})

bot.action('order_pickup', async (ctx: Context<Update.CallbackQueryUpdate>) => {
  ctx.answerCbQuery('Thank you!')
  const message = await onOrderConfirmPickup(ctx)
  if(message === null) { ctx.reply(ERR_NO_ACTIVE_ORDERS) } 
  else { ctx.reply(message, {parse_mode: 'HTML'}) }
});

bot.action('order_pickup_delay_20', async (ctx: Context<Update.CallbackQueryUpdate>) => {
  ctx.answerCbQuery('Thank you!')
  const message = await onOrderConfirmPickup(ctx, DELAY_DEFAULT)
  if(message === null) { ctx.reply(ERR_NO_ACTIVE_ORDERS) }
  else { ctx.reply(message, {parse_mode: 'HTML'}) }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))