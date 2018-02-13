// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import Program from './Program';
import RenderFoundation from '../RenderFoundation/RenderFoundation';

export default class EventProgram extends Program {
    _stage: RenderFoundation;

    constructor(initFn: ?(_this: Program) => void) {
        super();
        initFn && isFunction(initFn) && initFn(this);
    }

    get stage(): RenderFoundation {
        return this._stage;
    }

    set stage(stage: RenderFoundation) {
        this._stage = stage;
    }

    getStage() {
        return this._stage;
    }
}
