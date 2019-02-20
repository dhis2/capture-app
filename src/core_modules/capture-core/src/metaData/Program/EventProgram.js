// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import Program from './Program';
import ProgramStage from './ProgramStage';
import errorCreator from '../../utils/errorCreator';

export default class EventProgram extends Program {
    _stage: ?ProgramStage;

    static errorMessages = {
        STAGE_NOT_FOUND: 'Stage was not found',
    };

    constructor(initFn: ?(_this: Program) => void) {
        super();
        initFn && isFunction(initFn) && initFn(this);
    }

    get stage(): ?ProgramStage {
        return this._stage;
    }

    set stage(stage: ProgramStage) {
        this._stage = stage;
    }

    getStage() {
        return this._stage;
    }

    getStageThrowIfNull(): ProgramStage {
        if (!this._stage) {
            throw new Error(
                errorCreator(EventProgram.errorMessages.STAGE_NOT_FOUND)({ program: this }),
            );
        }
        return this._stage;
    }
}
