// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */

import isFunction from 'd2-utilizr/src/isFunction';
import RenderFoundation from '../RenderFoundation/RenderFoundation';
import RelationshipType from '../RelationshipType/RelationshipType';

export default class ProgramStage {
    _id: string;
    _stageForm: RenderFoundation;
    _relationshipTypes: Array<RelationshipType>;

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

    get relationshipTypes(): Array<RelationshipType> {
        return this._relationshipTypes;
    }

    set relationshipTypes(relationshipTypes: Array<RelationshipType>) {
        this._relationshipTypes = relationshipTypes;
    }
}
