// @flow
import * as React from 'react';
import { Checkbox, MenuDivider } from '@dhis2/ui';
import { noValueFilterTexts, noValueFilterKeys } from './constants';

type Props = {
    value?: ?string,
    onCommitValue?: (value: ?string) => void,
    emptyLabel?: string,
    notEmptyLabel?: string,
    showDivider?: boolean,
};

export const NoValueFilter = ({
    value,
    onCommitValue,
    emptyLabel = noValueFilterTexts[noValueFilterKeys.IS_EMPTY],
    notEmptyLabel = noValueFilterTexts[noValueFilterKeys.IS_NOT_EMPTY],
    showDivider = true,
}: Props) => {
    const isEmpty = value === noValueFilterKeys.IS_EMPTY;
    const isNotEmpty = value === noValueFilterKeys.IS_NOT_EMPTY;

    const handleEmptyChange = ({ checked }) => {
        onCommitValue && onCommitValue(checked ? noValueFilterKeys.IS_EMPTY : null);
    };

    const handleNotEmptyChange = ({ checked }) => {
        onCommitValue && onCommitValue(checked ? noValueFilterKeys.IS_NOT_EMPTY : null);
    };

    return (
        <div>
            <Checkbox
                label={emptyLabel}
                checked={isEmpty}
                onChange={handleEmptyChange}
            />
            <Checkbox
                label={notEmptyLabel}
                checked={isNotEmpty}
                onChange={handleNotEmptyChange}
            />
            {showDivider && <MenuDivider />}
        </div>
    );
};
