import { injectable } from 'tsyringe';
import { Command } from './command';

const DIRECTIVE = 'sample';

@injectable()
export default class SampleCommand implements Command {
  getDirective(): String {
    return DIRECTIVE;
  }
  execute(): void {
    console.log('Running sample');
  }
}
