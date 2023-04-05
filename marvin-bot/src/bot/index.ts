import { injectable } from "tsyringe";
import DiscordClient from "../client";

@injectable()
export default class MarvinBot {
  #client: DiscordClient;

  constructor(client: DiscordClient) {
    this.#client = client;
  }

  public listen() {
    this.#client.init();
  }
}
