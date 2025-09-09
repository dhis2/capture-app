import type { CachedAttributeValue } from '../../../../storageControllers';

type Style = {
    color?: string | null;
    icon?: string | null;
};

type Translation = {
    property: string;
    locale: string;
    value: string;
};

type Option = {
    id: string;
    code: string;
    displayName: string;
    style?: Style | null;
    translations: Array<Translation>;
};

type OptionGroup = {
    id: string;
    displayName: string;
    options: Array<string>;
};

type TrackedEntityTypeAttribute = {
    trackedEntityAttributeId: string;
    displayInList: boolean;
    mandatory: boolean;
    searchable: boolean;
    renderOptionsAsRadio?: boolean | null;
};

export type OptionSet = {
    id: string;
    displayName: string;
    valueType: string;
    options: Array<Option>;
    optionGroups: Array<OptionGroup>;
    translations: Array<Translation>;
    attributeValues: Array<CachedAttributeValue>;
};

export type TrackedEntityAttribute = {
    id: string;
    displayName: string;
    displayShortName: string;
    displayFormName: string;
    displayDescription: string;
    translations: Array<Translation>;
    valueType: string;
    optionSetValue: boolean;
    optionSet: { id: string };
    unique?: boolean | null;
    orgunitScope?: boolean | null;
    pattern?: string | null;
};

export type ProgramTrackedEntityAttribute = {
    trackedEntityAttributeId: string;
    displayInList: boolean;
    searchable: boolean;
    mandatory: boolean;
    renderOptionsAsRadio?: boolean | null;
    allowFutureDate?: boolean | null;
};

export type PluginElement = {
    id: string;
    name: string;
    type: string;
    pluginSource: string;
    fieldMap: Array<{ objectType: string; IdFromApp: string; IdFromPlugin: string }>;
};

export type TrackedEntityType = {
    id: string;
    displayName: string;
    trackedEntityTypeAttributes?: Array<TrackedEntityTypeAttribute> | null;
    minAttributesRequiredToSearch: number;
    featureType?: string | null;
};
