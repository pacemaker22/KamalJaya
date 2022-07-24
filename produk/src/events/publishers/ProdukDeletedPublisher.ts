import { ProdukDeletedEvent, Publisher, Subjects } from "@kjbuku/common";

export class ProdukDeletedPublisher extends Publisher<ProdukDeletedEvent> {
  subject: Subjects.ProdukDeleted = Subjects.ProdukDeleted;
}
