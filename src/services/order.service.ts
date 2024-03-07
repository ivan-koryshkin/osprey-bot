import { HUB_URI } from '../const'
import { Service } from './base.service'
import { 
    CartItem, 
    OrderPayload,
    CustomerRequest,
    OrderCreateRequest, 
    OrderCreateResponse,
    CustomerSyncResponse,
    OrderItemCreateResponse,
} from '../types'


const debug = process.env.DEBUG

export class OrderService extends Service {
    private payload?: OrderPayload
    private customer?: CustomerSyncResponse
    private externalId: string

    constructor(externalId: string, customer?: CustomerSyncResponse) {
        super('order')
        this.customer = customer
        this.externalId = externalId
    }

    private async parsePayload(data: any) : Promise<OrderPayload|null> {
        try {
            return JSON.parse(data) as OrderPayload
        } catch (e: any) {
            return null
        }
    }

    private async createOrder(payload: OrderPayload) : Promise<OrderCreateResponse|null>{
        const url = `${ HUB_URI }/application/order`
        try {
            const body: OrderCreateRequest = {
                items: payload.cartItems,
                customer: {
                    firstName: this.customer?.firstName,
                    lastName: this.customer?.lastName,
                    username: this.customer?.username,
                    externalId: this.customer?.externalId
                }
            }
            const res = await this.post(url, body)
            if(debug) { this.debug(res.status, 'create') }
            return (await res.json()) as OrderCreateResponse
        } catch(e: any) {
            return null
        }
    }

    async proccessOrder(webdata: any) : Promise<OrderCreateResponse|null> {
        const order = await this.parsePayload(webdata)
        if(order !== null) {
            return await this.createOrder(order)
        }
        return null
    }

    async confirmOrderDelivery(longitude: number, latitude: number) : Promise<boolean> {
        const url = `${ HUB_URI }/application/delivery`
        const response = await this.post(url, {
            latitude: latitude,
            longitude: longitude,
            externalId: this.externalId
        })
        if(debug) { 
            this.debug(response.status, 'confirm-delivery')
            const payload = await response.json()
            console.error(payload) 
        }
        return response.status === 200
    }

    async confirmOrderPickup(delay?: number) : Promise<boolean> {
        const url = `${ HUB_URI }/application/pickup`
        const response = await this.post(url, {
            delay: delay,
            externalId: this.externalId
        })
        if(debug) { this.debug(response.status, 'confirm-pickup') }
        return response.status === 200
    }

    async lastConfirmed(externalId: string) : Promise<OrderCreateResponse> {
        const url = `${ HUB_URI }/application/last-confirmed/${externalId}`
        const response = await this.get(url)
        if(debug) { this.debug(response.status, 'last-confirmed') }
        const payload = (await response.json()) as OrderCreateResponse
        return payload
    }
}