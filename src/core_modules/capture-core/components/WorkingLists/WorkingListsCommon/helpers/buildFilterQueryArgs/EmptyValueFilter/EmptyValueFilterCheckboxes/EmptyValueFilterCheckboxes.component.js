// @flow
import React from 'react';
import { Checkbox, MenuDivider } from '@dhis2/ui';
import { useFeature, FEATURES } from 'capture-core-utils/featuresSupport';
import {
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../emptyValueFilterHelpers';

type Props = {
    value: ?string,
    onEmptyChange: ({| checked: boolean |}) => void,
    onNotEmptyChange: ({| checked: boolean |}) => void,
};

export const EmptyValueFilterCheckboxes = ({
    value,
    onEmptyChange,
    onNotEmptyChange,
}: Props) => {
    const emptyValueFilterSupported = useFeature(FEATURES.emptyValueFilter);

    if (!emptyValueFilterSupported) {
        return null;
    }

    return (
        <div>
            <Checkbox
                label={EMPTY_VALUE_FILTER_LABEL}
                checked={value === EMPTY_VALUE_FILTER}
                onChange={onEmptyChange}
            />
            <Checkbox
                label={NOT_EMPTY_VALUE_FILTER_LABEL}
                checked={value === NOT_EMPTY_VALUE_FILTER}
                onChange={onNotEmptyChange}
            />
            <MenuDivider />
        </div>
    );
};
