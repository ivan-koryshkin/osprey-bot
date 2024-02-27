import { Context } from 'telegraf';
import { HUB_URI } from './const'


export const User = () => {
    const sync = async (ctx: Context): Promise<boolean> =>  {
        const url = `${HUB_URI}/customer/sync`
        const result = await fetch(url, {
            method: 'patch', 
            body: JSON.stringify({
                id: ctx.from.id,
                firstName: ctx.from.first_name,
                lastName: ctx.from.last_name,
                username: ctx.from.username,
                languageCode: ctx.from.language_code
            })
        })
        return result.status == 200
    }
}