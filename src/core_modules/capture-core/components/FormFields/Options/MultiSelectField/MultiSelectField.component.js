// @flow
import * as React from 'react';
import { useState, useEffect } from 'react';
import { MultiSelectField as MultiSelectFieldUI, MultiSelectOption } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';

export type MultiSelectOptionConfig = {
    label: string,
    value: any,
    id: string,
    icon?: ?React.Node,
};

const styles = () => ({
    label: {
        display: 'flex',
        alignItems: 'center',
    },
});

const MULTI_TEXT_SEPARATOR = ',';

type Props = {
    onSelect: (value: any) => void,
    onFocus: () => void,
    onBlur: () => void,
    options: Array<MultiSelectOptionConfig>,
    value: any,
    translations: {
        filterPlaceholder: string,
        noMatchText: string,
    },
    classes: {
        label: string,
    },
};

const MultiSelectFieldComponentPlain = (props: Props) => {
    const {
        onSelect,
        options,
        value,
        translations,
        onFocus,
        onBlur,
    } = props;
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        value?.length > 0 && setSelected(value.split(MULTI_TEXT_SEPARATOR));
    }, [value]);

    const onHandleChange = (multiSelect) => {
        const { selected: multiSelectSelected } = multiSelect;

        setSelected(multiSelectSelected);
        onSelect(multiSelectSelected.join(MULTI_TEXT_SEPARATOR));
    };

    return (
        <div onBlur={onBlur} tabIndex={-1}>
            <MultiSelectFieldUI
                onChange={onHandleChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onFocus}
                selected={selected}
                filterable
                filterPlaceholder={translations.filterPlaceholder}
                noMatchText={translations.noMatchText}
            >
                {options.map(option => (
                    <MultiSelectOption key={option.id} label={option.label} value={option.value} />
                ))}
            </MultiSelectFieldUI>
        </div>
    );
};

export const MultiSelectField = withStyles(styles)(MultiSelectFieldComponentPlain);
