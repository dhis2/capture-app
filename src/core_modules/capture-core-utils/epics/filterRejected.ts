import { filter } from 'rxjs/operators';
import { from } from 'rxjs';

export const filterRejected = (promise: Promise<any>) =>
    from(promise.catch((error) => { console.log(error); return null; }))
        .pipe(filter(result => result !== null));
