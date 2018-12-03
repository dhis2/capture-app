// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import Program from './Program';
import ProgramStage from './ProgramStage';

export default class EventProgram extends Program {
    _stage: ?ProgramStage;

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
}
