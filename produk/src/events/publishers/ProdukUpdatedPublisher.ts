import { ProdukUpdatedEvent, Publisher, Subjects } from "@kjbuku/common";

export class ProdukUpdatedPublisher extends Publisher<ProdukUpdatedEvent> {
  subject: Subjects.ProdukUpdated = Subjects.ProdukUpdated;
}
