/* eslint-disable no-underscore-dangle */
import { DataElement } from './DataElement.ts';

export class DateDataElement extends DataElement {
    private _allowFutureDate: boolean;
    constructor(initFn?: (_this: DateDataElement) => void) {
        super();
        this._allowFutureDate = true;
        initFn && initFn(this);
    }

    set allowFutureDate(allowFutureDate: boolean | undefined) {
        this._allowFutureDate = !!allowFutureDate;
    }

    get allowFutureDate(): boolean {
        return this._allowFutureDate;
    }
}
