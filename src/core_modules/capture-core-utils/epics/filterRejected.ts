import log from 'loglevel';
import { filter } from 'rxjs/operators';
import { from } from 'rxjs';

export const filterRejected = (promise: Promise<any>) =>
    from(promise.catch((error) => { log.info(error); return null; }))
        .pipe(filter(result => result !== null));
