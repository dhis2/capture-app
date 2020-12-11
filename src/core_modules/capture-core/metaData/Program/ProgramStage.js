// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */

import isFunction from 'd2-utilizr/lib/isFunction';
import RenderFoundation from '../RenderFoundation/RenderFoundation';
import RelationshipType from '../RelationshipType/RelationshipType';

export default class ProgramStage {
    _id: string;

    _name: string;

    _stageForm: RenderFoundation;

    _relationshipTypes: Array<RelationshipType>;

    _enableUserAssignment: boolean;

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
}
