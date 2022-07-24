import { Subjects, Publisher, PembayaranCreatedEvent } from "@kjbuku/common";

export class PembayaranCreatedPublisher extends Publisher<PembayaranCreatedEvent> {
  subject: Subjects.PembayaranCreated = Subjects.PembayaranCreated;
}
