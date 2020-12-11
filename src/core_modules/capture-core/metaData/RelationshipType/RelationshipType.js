// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';
import type { Access } from '../Access/Access';

type RelationshipConstraint = {
  entity: string,
  programId?: ?string,
  programStageId?: ?string,
  trackedEntityTypeId: string,
};

export default class RelationshipType {
  _id: string;

  _name: string;

  _access: Access;

  _from: RelationshipConstraint;

  _to: RelationshipConstraint;

  constructor(initFn: ?(_this: RelationshipType) => void) {
    initFn && isFunction(initFn) && initFn(this);
  }

  set id(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  set name(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  set access(access: Access) {
    this._access = access;
  }

  get access(): Access {
    return this._access;
  }

  set from(from: RelationshipConstraint) {
    this._from = from;
  }

  get from(): RelationshipConstraint {
    return this._from;
  }

  set to(to: RelationshipConstraint) {
    this._to = to;
  }

  get to(): RelationshipConstraint {
    return this._to;
  }
}
