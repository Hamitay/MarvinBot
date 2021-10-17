import 'reflect-metadata';
import { container } from 'tsyringe';
import MarvinBot from './bot';
import MarvinApi from './api';

const { API_ENABLED } = process.env;

const bot = container.resolve(MarvinBot);
bot.listen();

if (API_ENABLED) {
  const api = container.resolve(MarvinApi);
  api.serve();
}
