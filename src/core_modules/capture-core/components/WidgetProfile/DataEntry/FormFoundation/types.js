// @flow

import type { CachedAttributeValue } from '../../../../storageControllers';

type Style = {
    color?: ?string,
    icon?: ?string,
};
type Translation = {
    property: string,
    locale: string,
    value: string,
};
type Option = {
    id: string,
    code: string,
    displayName: string,
    style?: ?Style,
    translations: Array<Translation>,
};
type OptionGroup = {
    id: string,
    displayName: string,
    options: Array<string>,
};

type TrackedEntityTypeAttribute = {
    trackedEntityAttributeId: string,
    displayInList: boolean,
    mandatory: boolean,
    searchable: boolean,
    renderOptionsAsRadio: ?boolean,
};

export type OptionSet = {
    id: string,
    displayName: string,
    valueType: string,
    options: Array<Option>,
    optionGroups: Array<OptionGroup>,
    translations: Array<Translation>,
    attributeValues: Array<CachedAttributeValue>
};

export type TrackedEntityAttribute = {
    id: string,
    displayName: string,
    displayShortName: string,
    displayFormName: string,
    description: string,
    translations: Array<Translation>,
    valueType: string,
    optionSetValue: boolean,
    optionSet: { id: string },
    unique: ?boolean,
    orgunitScope: ?boolean,
    pattern: ?string,
};

export type ProgramTrackedEntityAttribute = {
    trackedEntityAttributeId: string,
    displayInList: boolean,
    searchable: boolean,
    mandatory: boolean,
    renderOptionsAsRadio: ?boolean,
    allowFutureDate?: ?boolean,
};

export type TrackedEntityType = {
    id: string,
    displayName: string,
    trackedEntityTypeAttributes: ?Array<TrackedEntityTypeAttribute>,
    minAttributesRequiredToSearch: number,
    featureType: ?string,
}
