import "reflect-metadata";
import { container } from "tsyringe";
import MarvinBot from "./bot";

const bot = container.resolve(MarvinBot);
bot.listen();
