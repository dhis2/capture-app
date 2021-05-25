// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';
import { Program } from './Program';
import type { TrackedEntityType } from '../TrackedEntityType';
import type { SearchGroup } from '../SearchGroup';
import type { Enrollment } from './Enrollment';
import type { DataElement } from '../DataElement';

export class TrackerProgram extends Program {
    _searchGroups: Array<SearchGroup>;
    _trackedEntityType: TrackedEntityType;
    _attributes: Array<DataElement>;
    _enrollment: Enrollment;

    constructor(initFn: ?(_this: TrackerProgram) => void) {
        super();
        this._attributes = [];
        initFn && isFunction(initFn) && initFn(this);
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
}
