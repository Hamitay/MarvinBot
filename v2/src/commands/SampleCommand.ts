import { injectable } from 'tsyringe';
import { Command } from './command';

const DIRECTIVE = 'sample';

@injectable()
export default class SampleCommand implements Command {
  getDirective(): string {
    return DIRECTIVE;
  }
  execute(): Promise<string> {
    return new Promise((resolve) => resolve('oi'));
  }
}
