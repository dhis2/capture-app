// @flow
import * as React from 'react';

type MultiSelectOptionConfig = {
    label: string,
    value: any,
    id: string,
    icon?: ?React.Node,
};

export type Props = {
    onSelect: (value?: string) => void,
    onFocus: () => void,
    onBlur: (value: ?string) => void,
    options: Array<MultiSelectOptionConfig>,
    value?: string,
    translations: {
        filterPlaceholder: string,
        noMatchText: string,
    },
    classes: {
        label: string,
        inputWrapperFocused: string,
        inputWrapperUnfocused: string,
    },
};
