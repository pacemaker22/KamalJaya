import { ProdukCreatedEvent, Publisher, Subjects } from "@kjbuku/common";

export class ProdukCreatedPublisher extends Publisher<ProdukCreatedEvent> {
  subject: Subjects.ProdukCreated = Subjects.ProdukCreated;
}
