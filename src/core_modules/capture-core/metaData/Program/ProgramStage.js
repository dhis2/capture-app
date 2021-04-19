
// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */

import isFunction from 'd2-utilizr/lib/isFunction';
import type { RenderFoundation } from '../RenderFoundation';
import type { RelationshipType } from '../RelationshipType';

export default class ProgramStage {
    _id: string;
    _name: string;
    _displayDescription: string;
    _stageForm: RenderFoundation;
    _relationshipTypes: Array<RelationshipType>;
    _enableUserAssignment: boolean;
    _autoGenerateEvent: boolean;
    _openAfterEnrollment: boolean;
    _generatedByEnrollmentDate: boolean;
    _reportDateToUse: string;
    _minDaysFromStart: number;

    constructor(initFn: ?(_this: ProgramStage) => void) {
        initFn && isFunction(initFn) && initFn(this);
    }

    get stageForm(): RenderFoundation {
        return this._stageForm;
    }

    set stageForm(stageForm: RenderFoundation) {
        this._stageForm = stageForm;
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get relationshipTypes(): Array<RelationshipType> {
        return this._relationshipTypes;
    }

    get relationshipTypesWhereStageIsFrom(): Array<RelationshipType> {
        return this._relationshipTypes ? this._relationshipTypes.filter(r => r.from.programStageId && r.from.programStageId === this.id) : [];
    }

    set relationshipTypes(relationshipTypes: Array<RelationshipType>) {
        this._relationshipTypes = relationshipTypes;
    }

    get enableUserAssignment(): boolean {
        return this._enableUserAssignment;
    }

    set enableUserAssignment(enable: boolean) {
        this._enableUserAssignment = enable;
    }

    get autoGenerateEvent(): boolean {
        return this._autoGenerateEvent;
    }

    set autoGenerateEvent(autoGenerate: boolean) {
        this._autoGenerateEvent = autoGenerate;
    }

    get generatedByEnrollmentDate(): boolean {
        return this._generatedByEnrollmentDate;
    }

    set generatedByEnrollmentDate(generate: boolean) {
        this._generatedByEnrollmentDate = generate;
    }

    get openAfterEnrollment(): boolean {
        return this._openAfterEnrollment;
    }

    set openAfterEnrollment(open: boolean) {
        this._openAfterEnrollment = open;
    }

    get reportDateToUse(): string {
        return this._reportDateToUse;
    }

    set reportDateToUse(reportDate: string = 'enrollmentDate') {
        if (reportDate === 'false') {
            this._reportDateToUse = 'enrollmentDate';
        } else {
            this._reportDateToUse = reportDate;
        }
    }

    get minDaysFromStart(): number {
        return this._minDaysFromStart;
    }

    set minDaysFromStart(minDays: number = 0) {
        this._minDaysFromStart = minDays;
    }
}
