import express from "express";
import { json } from "body-parser";
import { injectable } from "tsyringe";
import DiscordClient from "../client";

import cors from "cors";

export interface MessageRequest {
  id: string;
  messageBody: string;
}

const PORT = 5000;

@injectable()
export default class MarvinApi {
  #discordClient: DiscordClient;

  constructor(discordClient: DiscordClient) {
    this.#discordClient = discordClient;
  }

  serve() {
    const app = express();
    app.use(cors())

    app.post("/message", json(), async (req, res) => {
      const message = req.body as MessageRequest;
      try {
        await this.#discordClient.postMessage(message.id, message.messageBody);
      } catch (e) {
        console.error(e);
        res.send(500);
      }

      res.send(200);
    });

    app.listen(PORT, () => console.log("Api enabled and listening on port: " + PORT));
  }
}
