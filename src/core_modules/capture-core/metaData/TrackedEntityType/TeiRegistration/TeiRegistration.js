// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/src/isFunction';
import { RenderFoundation } from '../../RenderFoundation';
import { InputSearchGroup } from '../../InputSearchGroup';
import { TrackedEntityType } from '../../TrackedEntityType';

export default class TeiRegistration {
    _form: RenderFoundation;
    _inputSearchGroups: ?Array<InputSearchGroup>;
    _trackedEntityType: TrackedEntityType;

    constructor(initFn: ?(_this: TeiRegistration) => void) {
        initFn && isFunction(initFn) && initFn(this);
    }

    set form(formFoundation: RenderFoundation) {
        this._form = formFoundation;
    }
    get form(): RenderFoundation {
        return this._form;
    }

    set inputSearchGroups(searchGroups: Array<InputSearchGroup>) {
        this._inputSearchGroups = searchGroups;
    }
    get inputSearchGroups(): ?Array<InputSearchGroup> {
        return this._inputSearchGroups;
    }

    set trackedEntityType(type: TrackedEntityType) {
        this._trackedEntityType = type;
    }
    get trackedEntityType(): TrackedEntityType {
        return this._trackedEntityType;
    }
}
