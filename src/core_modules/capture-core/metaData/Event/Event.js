// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';

export class Event {
    _id: string;
    _programStageId: string;
    _orgUnitId: string;
    _trackedEntityInstanceId: string;
    _enrollmentId: string;
    _enrollmentStatus: string;
    _status: string ;
    _orgUnitName: string;
    _occurredAt: string | Date;

    constructor(initFn: ?(_this: Event) => void) {
        initFn && isFunction(initFn) && initFn(this);
    }

    set id(id: string) {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }

    set programStageId(programStageId: string) {
        this._programStageId = programStageId;
    }
    get programStageId(): string {
        return this._programStageId;
    }

    set orgUnitId(orgUnitId: string) {
        this._orgUnitId = orgUnitId;
    }
    get orgUnitId(): string {
        return this._orgUnitId;
    }

    set orgUnitName(name: string) {
        this._orgUnitName = name;
    }
    get orgUnitName(): string {
        return this._orgUnitName;
    }

    set trackedEntityInstanceId(trackedEntityInstanceId: string) {
        this._trackedEntityInstanceId = trackedEntityInstanceId;
    }
    get trackedEntityInstanceId(): string {
        return this._trackedEntityInstanceId;
    }

    set enrollmentId(enrollmentId: string) {
        this._enrollmentId = enrollmentId;
    }
    get enrollmentId(): string {
        return this._enrollmentId;
    }

    set enrollmentStatus(enrollmentStatus: string) {
        this._enrollmentStatus = enrollmentStatus;
    }
    get enrollmentStatus(): string {
        return this._enrollmentStatus;
    }

    set status(status: string) {
        this._status = status;
    }
    get status(): string {
        return this._status;
    }

    set occurredAt(occurredAt: string | Date) {
        this._occurredAt = occurredAt;
    }
    get occurredAt(): string | Date {
        return this._occurredAt;
    }
}
