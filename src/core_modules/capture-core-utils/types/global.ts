import type { Observable } from 'rxjs';
import type { Action } from 'redux';

/**
 * Represents an Observable stream of Redux actions with a specific payload type.
 *
 * @template PayloadType The type of the action's payload.
 */
export type EpicAction<PayloadType> = Observable<Action & { payload: PayloadType }>;
