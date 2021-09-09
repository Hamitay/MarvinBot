import 'reflect-metadata';
import { container } from 'tsyringe';
import MarvinBot from './bot';
import MarvinApi from './api';
const bot = container.resolve(MarvinBot);
const api = container.resolve(MarvinApi);

bot.listen();
api.serve();
