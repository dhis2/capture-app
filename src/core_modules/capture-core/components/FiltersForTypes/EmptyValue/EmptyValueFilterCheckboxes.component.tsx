import React from 'react';
import { Checkbox, MenuDivider, spacersNum } from '@dhis2/ui';
import { useFeature, FEATURES } from 'capture-core-utils/featuresSupport';
import {
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from './emptyValue.const';
import type { EmptyValueFilterCheckboxesProps } from './emptyValue.types';

const styles = {
    checkbox: {
        marginTop: spacersNum.dp4,
        marginBottom: spacersNum.dp8,
    },
};

export const EmptyValueFilterCheckboxes = ({
    value,
    onEmptyChange,
    onNotEmptyChange,
    showDivider = true,
    disabled = false,
}: EmptyValueFilterCheckboxesProps) => {
    const emptyValueFilterSupported = useFeature(FEATURES.emptyValueFilter);

    if (!emptyValueFilterSupported || disabled) {
        return null;
    }

    return (
        <div>
            <div style={styles.checkbox}>
                <Checkbox
                    label={EMPTY_VALUE_FILTER_LABEL}
                    checked={value === EMPTY_VALUE_FILTER}
                    onChange={onEmptyChange}
                />
            </div>
            <div style={styles.checkbox}>
                <Checkbox
                    label={NOT_EMPTY_VALUE_FILTER_LABEL}
                    checked={value === NOT_EMPTY_VALUE_FILTER}
                    onChange={onNotEmptyChange}
                />
            </div>
            {showDivider && <MenuDivider />}
        </div>
    );
};
