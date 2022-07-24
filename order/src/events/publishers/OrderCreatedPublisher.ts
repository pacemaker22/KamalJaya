import { Publisher, OrderCreatedEvent, Subjects } from "@kjbuku/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
