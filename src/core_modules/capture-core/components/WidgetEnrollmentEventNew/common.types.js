// @flow

export type OrgUnit = {
    id: string,
    name: string,
    code: string,
};

export type ExternalSaveHandler = (eventServerValues: Object) => void;
