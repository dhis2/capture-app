// @flow
import React from 'react';
import { Checkbox, MenuDivider } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useFeature, FEATURES } from 'capture-core-utils/featuresSupport';
import { EMPTY_FILTER_VALUE, NOT_EMPTY_FILTER_VALUE } from '../constants';

type Props = {
    value: ?string,
    onEmptyChange: ({| checked: boolean |}) => void,
    onNotEmptyChange: ({| checked: boolean |}) => void,
    showDivider?: boolean,
};

export const EmptyValueFilterCheckboxes = ({
    value,
    onEmptyChange,
    onNotEmptyChange,
    showDivider = true,
}: Props) => {
    const nullValueFiltersSupported = useFeature(FEATURES.nullValueFilters);

    if (!nullValueFiltersSupported) {
        return null;
    }

    return (
        <div>
            <Checkbox
                label={i18n.t('Is empty')}
                checked={value === EMPTY_FILTER_VALUE}
                onChange={onEmptyChange}
            />
            <Checkbox
                label={i18n.t('Is not empty')}
                checked={value === NOT_EMPTY_FILTER_VALUE}
                onChange={onNotEmptyChange}
            />
            {showDivider && <MenuDivider />}
        </div>
    );
};
