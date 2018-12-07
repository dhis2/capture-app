// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/src/isFunction';
import { RenderFoundation } from '../../RenderFoundation';
import { labelKeys, defaultLabelValues } from './labels.const';

export default class Enrollment {
    _labels: { [key: $Values<typeof labelKeys>]: string };
    _enrollmentForm: RenderFoundation;

    constructor(initFn: ?(_this: Enrollment) => void) {
        this._labels = {
            [labelKeys.INCIDENT_DATE]: defaultLabelValues.INCIDENT_DATE,
            [labelKeys.ENROLLMENT_DATE]: defaultLabelValues.ENROLLMENT_DATE,
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
}
