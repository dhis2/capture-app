// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';
import { RenderFoundation } from '../../RenderFoundation';
import { InputSearchGroup } from '../../InputSearchGroup';
import { TrackedEntityType } from '../../TrackedEntityType';
import { labelKeys, defaultLabelValues } from './labels.const';

type OptionFlags = {
    allowFutureEnrollmentDate: boolean,
    allowFutureIncidentDate: boolean,
    showIncidentDate: boolean,
};

export default class Enrollment {
    _labels: { [key: $Values<typeof labelKeys>]: string };
    _optionFlags: OptionFlags;
    _enrollmentForm: RenderFoundation;
    _inputSearchGroups: ?Array<InputSearchGroup>;
    _trackedEntityType: TrackedEntityType;

    constructor(initFn: ?(_this: Enrollment) => void) {
        this._labels = {
            [labelKeys.INCIDENT_DATE]: defaultLabelValues.INCIDENT_DATE,
            [labelKeys.ENROLLMENT_DATE]: defaultLabelValues.ENROLLMENT_DATE,
        };

        this._optionFlags = {
            allowFutureEnrollmentDate: false,
            allowFutureIncidentDate: false,
            showIncidentDate: true,
        };

        initFn && isFunction(initFn) && initFn(this);
    }

    set enrollmentForm(formFoundation: RenderFoundation) {
        this._enrollmentForm = formFoundation;
    }
    get enrollmentForm(): RenderFoundation {
        return this._enrollmentForm;
    }

    set incidentDateLabel(label: string) {
        this._labels[labelKeys.INCIDENT_DATE] = label;
    }
    get incidentDateLabel(): string {
        return this._labels[labelKeys.INCIDENT_DATE];
    }

    set enrollmentDateLabel(label: string) {
        this._labels[labelKeys.ENROLLMENT_DATE] = label;
    }
    get enrollmentDateLabel(): string {
        return this._labels[labelKeys.ENROLLMENT_DATE];
    }

    set allowFutureEnrollmentDate(isAllowed: boolean) {
        this._optionFlags.allowFutureEnrollmentDate = isAllowed;
    }
    get allowFutureEnrollmentDate(): boolean {
        return this._optionFlags.allowFutureEnrollmentDate;
    }

    set allowFutureIncidentDate(isAllowed: boolean) {
        this._optionFlags.allowFutureIncidentDate = isAllowed;
    }
    get allowFutureIncidentDate(): boolean {
        return this._optionFlags.allowFutureIncidentDate;
    }

    set showIncidentDate(show: boolean) {
        this._optionFlags.showIncidentDate = show;
    }
    get showIncidentDate(): boolean {
        return this._optionFlags.showIncidentDate;
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
