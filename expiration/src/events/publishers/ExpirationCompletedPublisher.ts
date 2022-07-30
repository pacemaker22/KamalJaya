import {
    Subjects,
    Publisher,
    ExpirationCompletedEvent,
  } from "@kjbuku/common";
  
  export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  }
  