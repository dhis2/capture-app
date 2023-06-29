// @flow
import * as React from 'react';
import { compose } from 'redux';
import { useState, useEffect } from 'react';
import { MultiSelectField as MultiSelectFieldUI, MultiSelectOption } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { withFocusHandler } from './withFocusHandler';
import type { Props } from './MultiSelectField.types';

const styles = theme => ({
    label: {
        display: 'flex',
        alignItems: 'center',
    },
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.primary.light}`,
        borderRadius: '5px',
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
});

const MULTI_TEXT_SEPARATOR = ',';

const MultiSelectFieldComponentPlain = (props: Props) => {
    const { onSelect, options, value = '', translations, onFocus, onBlur } = props;
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const multiSelectValue = (value === null || value === '') ? [] : value.split(MULTI_TEXT_SEPARATOR);
        setSelected(multiSelectValue);
    }, [value]);

    const onHandleChange = (multiSelect) => {
        const { selected: multiSelectSelected } = multiSelect;

        setSelected(multiSelectSelected);
        onSelect(multiSelectSelected.join(MULTI_TEXT_SEPARATOR));
    };

    return (
        <MultiSelectFieldUI
            dataTest="multi-select-field"
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
    );
};

export const MultiSelectField = compose(withStyles(styles), withFocusHandler())(MultiSelectFieldComponentPlain);
