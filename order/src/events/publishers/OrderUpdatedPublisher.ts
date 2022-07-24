import { Publisher, OrderUpdatedEvent, Subjects } from "@kjbuku/common";

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}
