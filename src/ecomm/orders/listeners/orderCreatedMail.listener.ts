import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MailService } from "src/mail/mail.service";
import { OrderCreatedEvent } from "../events/orderCreated.event";


@Injectable()
export class OrderCreatedEmailListener {
    constructor(
        private readonly mailService: MailService
    ) {}

    @OnEvent('order.created')
    async handleConfirmationEmail (event: OrderCreatedEvent) {
        console.log("Mail process started")
        await this.mailService.sendOrderConfirmationMail(event)
    }
}