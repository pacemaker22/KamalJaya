import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Tidak bisa mengakses NATS,tidak terhubung");
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, {
      url,
      waitOnFirstConnect: true,
    });

    return new Promise<void>((resolve, reject) => {
      this.client.on("Terhubung", () => {
        console.log("Terhubung ke Nats");
        resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
