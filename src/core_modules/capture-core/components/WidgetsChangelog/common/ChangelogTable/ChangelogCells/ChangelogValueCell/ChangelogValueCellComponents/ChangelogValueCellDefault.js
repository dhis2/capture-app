// @flow
import React from 'react';
import { IconArrowRight16 } from '@dhis2/ui';
import { CHANGE_TYPES } from '../../../../Changelog/Changelog.constants';
import type { ChangelogValueCellProps } from './ChangelogValueCellComponents.types';

const Updated = ({ previousValue, currentValue, classes }: ChangelogValueCellProps) => (
    <div className={classes.container}>
        <span className={classes.updatePreviousValue}>{previousValue}</span>
        <span className={classes.updateArrow}>
            <IconArrowRight16 />
        </span>
        <span className={classes.updateCurrentValue}>{currentValue}</span>
    </div>
);

const Created = ({ currentValue, classes }: ChangelogValueCellProps) => (
    <div className={classes.container}>
        <span className={classes.currentValue}>{currentValue}</span>
    </div>
);

const Deleted = ({ previousValue, classes }: ChangelogValueCellProps) => (
    <div className={classes.container}>
        <span className={classes.previousValue}>{previousValue}</span>
    </div>
);

export const DefaultChangelogComponentsByChangeType = Object.freeze({
    [CHANGE_TYPES.UPDATED]: Updated,
    [CHANGE_TYPES.CREATED]: Created,
    [CHANGE_TYPES.DELETED]: Deleted,
});
