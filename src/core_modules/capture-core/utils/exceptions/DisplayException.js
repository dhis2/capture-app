// @flow
export function DisplayException(message: string, innerError: any) {
  this.message = message;
  this.innerError = innerError;
  this.toString = () => this.message;
}
