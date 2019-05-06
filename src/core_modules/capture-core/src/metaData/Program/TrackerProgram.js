// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import Program from './Program';
import ProgramStage from './ProgramStage';
import { TrackedEntityType } from '../TrackedEntityType';
import errorCreator from '../../utils/errorCreator';
import { SearchGroup } from '../SearchGroup';
import { Enrollment } from './Enrollment';
import { DataElement } from '../DataElement';


export default class TrackerProgram extends Program {
    _stages: Map<string, ProgramStage>;
    _searchGroups: Array<SearchGroup>;
    _trackedEntityType: TrackedEntityType;
    _attributes: Array<DataElement>;
    _enrollment: Enrollment;

    static errorMessages = {
        STAGE_NOT_FOUND: 'Stage was not found',
        STAGE_INDEX_NOT_FOUND: 'No stage found on index',
    };

    constructor(initFn: ?(_this: Program) => void) {
        super();
        this._attributes = [];
        this._stages = new Map();
        initFn && isFunction(initFn) && initFn(this);
    }

    // $FlowSuppress
    * [Symbol.iterator](): Iterator<ProgramStage> {
        for (const stage of this._stages.values()) {
            yield stage;
        }
    }

    get stages(): Map<string, ProgramStage> {
        return this._stages;
    }

    get searchGroups(): Array<SearchGroup> {
        return this._searchGroups;
    }
    set searchGroups(searchGroups: Array<SearchGroup>) {
        this._searchGroups = searchGroups;
    }

    get trackedEntityType(): TrackedEntityType {
        return this._trackedEntityType;
    }
    set trackedEntityType(trackedEntityType: TrackedEntityType) {
        this._trackedEntityType = trackedEntityType;
    }

    get enrollment(): Enrollment {
        return this._enrollment;
    }
    set enrollment(enrollment: Enrollment) {
        this._enrollment = enrollment;
    }

    get attributes(): Array<DataElement> {
        return this._attributes;
    }
    set attributes(attributes: Array<DataElement>) {
        this._attributes = attributes;
    }

    addStage(stage: ProgramStage) {
        this.stages.set(stage.id, stage);
    }

    getStage(id: string): ?ProgramStage {
        return this.stages.get(id);
    }

    getStageThrowIfNotFound(id: string): ProgramStage {
        const stage = this.stages.get(id);
        if (!stage) {
            throw new Error(
                errorCreator(TrackerProgram.errorMessages.STAGE_NOT_FOUND)({ program: this, stageId: id }),
            );
        }
        return stage;
    }

    getStageFromIndex(index: number): ProgramStage {
        const stage = this.stages.entries()[index];
        if (!stage) {
            throw new Error(
                errorCreator(TrackerProgram.errorMessages.STAGE_INDEX_NOT_FOUND)({ program: this, stageIndex: index }),
            );
        }
        return stage;
    }
}
