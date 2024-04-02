import { HUB_URI } from "../const";
import { BrokerChannelResponse } from "../types";
import { Service } from "./base.service";

const debug = process.env.DEBUG

export class ChannelService extends Service {
    constructor() {
        super('CHANNEL-REQUEST')
    }

    async requestChannel() : Promise<BrokerChannelResponse> {
        const url: string = `${HUB_URI}/application/channel/read`
        const result: Response = await this.get(url)
        if(debug) { this.debug(result.status, 'sync') }
        return await result.json() as BrokerChannelResponse
    }
}
