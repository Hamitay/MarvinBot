export interface Command {
  getDirective() : String;
  execute(args: String[]) : void;
}
