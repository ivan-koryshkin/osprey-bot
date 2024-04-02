export interface CustomerSyncResponse {
    id: string
    blocked: boolean
    externalId: string
    firstName?: string
    lastName?: string
    username?: string
}

export interface CartItem {
    productId: string,
    name: string,
    count: number,
}

export interface CustomerRequest {
    externalId: string
    firstName?: string
    lastName?: string
    username?: string
}

export interface OrderPayload {
    cartItems: CartItem[]
}

export interface OrderCreateRequest {
    customer: CustomerRequest
    items: CartItem[]
}


export interface OrderItemProductCreateResponse {
    id: string
    name: string
    price: number
    hide: boolean
    description: string
}

export interface OrderItemCreateResponse {
    count: number
    product: OrderItemProductCreateResponse
}

export interface OrderCreateResponse {
    id: string
    confirmedAt?: string
    createdAt: Date
    items: OrderItemCreateResponse[]
}

export interface OrderConfirmationMessage extends OrderCreateResponse{
    total: number
}

export interface MqMessage {
    type: 'feedback' | 'broadcast'
    message: string
    userId: string 
}

export interface BrokerChannelResponse {
    id: string
    account: string
    name: string
    token: string
}