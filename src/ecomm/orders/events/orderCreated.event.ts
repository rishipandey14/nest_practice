export interface OrderCreatedItem {
    productId: string,
    quantity: number
}

export class OrderCreatedEvent {
    constructor(
        public readonly orderId: string,
        public readonly email: string,
        public readonly items: OrderCreatedItem[]
    ) {}
}
