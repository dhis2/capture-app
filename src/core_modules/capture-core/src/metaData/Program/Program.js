// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import RenderFoundation from '../RenderFoundation/RenderFoundation';
import errorCreator from '../../utils/errorCreator';

// import MetaDataElement from './MetaDataElement';
// $FlowSuppress
// import {elementTypeConstants} from './elementTypes';

export default class Program {
    static errorMessages = {
        STAGE_NOT_FOUND: 'Stage was not found',
        STAGE_INDEX_NOT_FOUND: 'No stage found on index',
    };
    _stages: Map<string, RenderFoundation>;
    _id: string;
    _name: string;
    _shortName: string;
    _version: string | number;

    constructor(initFn: ?(_this: Program) => void) {
        this._stages = new Map();
        initFn && isFunction(initFn) && initFn(this);
    }

    // $FlowSuppress
    * [Symbol.iterator](): Iterator<RenderFoundation> {
        for (const stage of this._stages.values()) {
            yield stage;
        }
    }

    set id(id: string): void {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }

    set name(name: string) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }

    set shortName(shortName: string) {
        this._shortName = shortName;
    }
    get shortName(): string {
        return this._shortName;
    }

    get stages(): Map<string, RenderFoundation> {
        return this._stages;
    }

    addStage(stage: RenderFoundation) {
        this.stages.set(stage.id, stage);
    }

    getStage(id: string): ?RenderFoundation {
        return this.stages.get(id);
    }
    
    getStageThrowIfNotFound(id: string): RenderFoundation {
        const stage = this.stages.get(id);
        if (!stage) {
            throw new Error(
                errorCreator(Program.errorMessages.STAGE_NOT_FOUND)({ program: this, stageId: id }),
            );
        }
        return stage;
    }

    getStageFromIndex(index: number): RenderFoundation {
        const stage = this.stages.entries()[index];
        if (!stage) {
            throw new Error(
                errorCreator(Program.errorMessages.STAGE_INDEX_NOT_FOUND)({ program: this, stageIndex: index }),
            );
        }
        return stage;
    }

    /*
    convertValues(values: ?valuesType | Array<valuesType>, typeConverters: {[type: $Keys<typeof elementTypeConstants>]: (rawValue: any, metaDataElement: MetaDataElement) => any}, useCodeNameKey: boolean = false) {
        return Array.from(this._metaDataSets.values()).reduce((accConvertedValues: ?valuesType | Array<valuesType>, currentMetaDataSet: MetaDataSet) => currentMetaDataSet.convertValues(accConvertedValues, typeConverters, useCodeNameKey), values);
    }
    */
}

// type valuesType = {[key: string | number]: any};
