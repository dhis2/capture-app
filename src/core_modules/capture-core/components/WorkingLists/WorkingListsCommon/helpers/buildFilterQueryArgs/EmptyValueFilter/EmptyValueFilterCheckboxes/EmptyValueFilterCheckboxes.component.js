// @flow
import React from 'react';
import { Checkbox, MenuDivider } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useFeature, FEATURES } from 'capture-core-utils/featuresSupport';
import { EMPTY_VALUE_FILTER, NOT_EMPTY_VALUE_FILTER } from '../constants';

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
    const nullValueFiltersSupported = useFeature(FEATURES.nullValueFilters);

    if (!nullValueFiltersSupported) {
        return null;
    }

    return (
        <div>
            <Checkbox
                label={i18n.t('Is empty')}
                checked={value === EMPTY_VALUE_FILTER}
                onChange={onEmptyChange}
            />
            <Checkbox
                label={i18n.t('Is not empty')}
                checked={value === NOT_EMPTY_VALUE_FILTER}
                onChange={onNotEmptyChange}
            />
            <MenuDivider />
        </div>
    );
};
