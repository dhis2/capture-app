/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/lib/isFunction';
import { Program } from './Program';
import type { ProgramStage } from './ProgramStage';

export class EventProgram extends Program {
    static EVENT_PROGRAM_STAGE_KEY = 'EventProgramStage';

    constructor(initFn?: (_this: EventProgram) => void) {
        super();
        initFn && isFunction(initFn) && initFn(this);
    }

    set stage(stage: ProgramStage) {
        this._stages.set(EventProgram.EVENT_PROGRAM_STAGE_KEY, stage);
    }
    get stage(): ProgramStage {
        return this._stages.get(EventProgram.EVENT_PROGRAM_STAGE_KEY)!;
    }

    getStage(): ProgramStage {
        return this._stages.get(EventProgram.EVENT_PROGRAM_STAGE_KEY)!;
    }
}
