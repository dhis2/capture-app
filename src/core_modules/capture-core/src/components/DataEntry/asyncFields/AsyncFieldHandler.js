// @flow

import { Promise } from "core-js";
import isDefined from 'd2-utilizr/src/isDefined';
import getDataEntryKey from '../common/getDataEntryKey';


class AsyncFieldHandler {
    dataEntryItemPromises: { [string]: ?Array<Promise> }

    constructor() {
        this.dataEntryItemPromises = {};
    }

    removePromise = (dataEntryKey: string, promise: Promise) => {
        if (this.dataEntryItemPromises[dataEntryKey]) {
            const index = this.dataEntryItemPromises[dataEntryKey].indexOf(promise);
            if (index >= 0) {
                // $FlowSuppress
                this.dataEntryItemPromises[dataEntryKey].splice(index, 1);
            }
            // $FlowSuppress
            if (this.dataEntryItemPromises[dataEntryKey].length === 0) {
                this.dataEntryItemPromises[dataEntryKey] = null;
            }
        }
    }

    setPromise = (dataEntryKey: string, promise: Promise) => {
        if (!this.dataEntryItemPromises[dataEntryKey]) {
            this.dataEntryItemPromises[dataEntryKey] = [];
        }
        // $FlowSuppress
        this.dataEntryItemPromises[dataEntryKey].push(promise);
    }

    hasPromises = (dataEntryId: string, itemId: string) => {
        const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
        const promises = this.dataEntryItemPromises[dataEntryKey];

        return !!promises;
    }

    executeAsyncCallback = (dataEntryId: string, itemId: string, callback: Function, next: Function) => {
        const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
        const promise = callback().then((value: any) => {
            this.removePromise(dataEntryKey, promise);
            return value;
        });
        this.setPromise(dataEntryKey, promise);
        return promise;
    }

    getDataEntryItemPromise = (dataEntryId: string, itemId: string) => {
        const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
        const promises = this.dataEntryItemPromises[dataEntryKey] || [];
        return Promise.all(promises);
    }
}

const asyncFieldHandler = new AsyncFieldHandler();

export default asyncFieldHandler;
