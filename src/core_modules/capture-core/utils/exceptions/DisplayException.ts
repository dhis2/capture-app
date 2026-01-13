export function DisplayException(this: any, message: string, innerError: any) {
    this.message = message;
    this.innerError = innerError;
    this.toString = () => this.message;
}
