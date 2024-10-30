// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */

import isFunction from 'd2-utilizr/lib/isFunction';
import type { ProgramRule } from '@dhis2/rules-engine-javascript';
import type { Icon } from '../Icon';
import type { RenderFoundation } from '../RenderFoundation';
import type { RelationshipType } from '../RelationshipType';

export class ProgramStage {
    _id: string;
    _name: string;
    _access: { data: { write: boolean } };
    _blockEntryForm: boolean;
    _untranslatedName: string;
    _stageForm: RenderFoundation;
    _relationshipTypes: Array<RelationshipType>;
    _enableUserAssignment: boolean;
    _autoGenerateEvent: boolean;
    _openAfterEnrollment: boolean;
    _allowGenerateNextVisit: boolean;
    _askCompleteEnrollmentOnEventComplete: boolean;
    _generatedByEnrollmentDate: boolean;
    _repeatable: boolean;
    _hideDueDate: boolean;
    _reportDateToUse: string;
    _minDaysFromStart: number;
    _icon: Icon | void;
    _programRules: Array<ProgramRule>;

    constructor(initFn: ?(_this: ProgramStage) => void) {
        this.programRules = [];
        initFn && isFunction(initFn) && initFn(this);
    }

    get stageForm(): RenderFoundation {
        return this._stageForm;
    }

    set stageForm(stageForm: RenderFoundation) {
        this._stageForm = stageForm;
    }

    get blockEntryForm(): boolean {
        return this._blockEntryForm;
    }

    set blockEntryForm(blockEntryForm: boolean) {
        this._blockEntryForm = blockEntryForm;
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

    get access(): { data: { write: boolean } } {
        return this._access;
    }

    set access(acess: { data: { write: boolean } }) {
        this._access = acess;
    }

    get untranslatedName(): string {
        return this._untranslatedName;
    }

    set untranslatedName(untranslatedName: string) {
        this._untranslatedName = untranslatedName;
    }

    set icon(icon: Icon | void) {
        this._icon = icon;
    }
    get icon(): Icon | void {
        return this._icon;
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

    get allowGenerateNextVisit(): boolean {
        return this._allowGenerateNextVisit;
    }

    set allowGenerateNextVisit(generateNextVisit: boolean) {
        this._allowGenerateNextVisit = generateNextVisit;
    }

    get askCompleteEnrollmentOnEventComplete(): boolean {
        return this._askCompleteEnrollmentOnEventComplete;
    }

    set askCompleteEnrollmentOnEventComplete(askCompleteEnrollmentOnEventComplete: boolean) {
        this._askCompleteEnrollmentOnEventComplete = askCompleteEnrollmentOnEventComplete;
    }

    get hideDueDate(): boolean {
        return this._hideDueDate;
    }

    set hideDueDate(hideDueDate: boolean) {
        this._hideDueDate = hideDueDate;
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

    set reportDateToUse(reportDate: string = 'enrolledAt') {
        if (reportDate === 'false') {
            this._reportDateToUse = 'enrolledAt';
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

    set programRules(programRules: Array<ProgramRule>) {
        this._programRules = programRules;
    }
    get programRules(): Array<ProgramRule> {
        return this._programRules;
    }

    set repeatable(repeatable: boolean) {
        this._repeatable = repeatable;
    }

    get repeatable(): boolean {
        return this._repeatable;
    }
}
