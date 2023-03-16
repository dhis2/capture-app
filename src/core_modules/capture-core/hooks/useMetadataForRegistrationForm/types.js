// @flow
type OptionGroup = {
    id: string,
    displayName: string,
    options: Array<string>,
};

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

export type OptionSet = {|
    id: string,
    displayName: string,
    valueType: string,
    options: Array<Option>,
    optionGroups: Array<OptionGroup>,
    translations: Array<Translation>
|}

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
