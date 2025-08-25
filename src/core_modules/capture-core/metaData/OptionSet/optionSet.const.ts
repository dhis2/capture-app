export const inputTypes = {
    DROPDOWN: 'dropdown',
    VERTICAL_RADIOBUTTONS: 'verticalRadiobuttons',
    HORIZONTAL_RADIOBUTTONS: 'horizontalRadiobuttons',
};

export type InputType = typeof inputTypes[keyof typeof inputTypes];

export const inputTypesAsArray: InputType[] = Object
    .keys(inputTypes)
    .map(key => inputTypes[key as keyof typeof inputTypes]);

export const viewTypes = {
    ICON: 'ICON',
    ICON_WITH_COLOR: 'ICON_WITH_COLOR',
};

export type ViewType = typeof viewTypes[keyof typeof viewTypes];
