// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { colors, spacers } from '@dhis2/ui';
import { CHANGE_TYPES } from '../../../Changelog/Changelog.constants';
import {
    DefaultChangelogComponentsByChangeType,
    PlygonChangelogComponentsByChangeType,
} from './ChangelogValueCellComponents';

type Props = {
    dataItemId: string,
    changeType: $Values<typeof CHANGE_TYPES>,
    previousValue?: string,
    currentValue?: string,
    classes: {
        container: string,
        valueContainer: string,
        buttonContainer: string,
        previousValue: string,
        currentValue: string,
        updatePreviousValue: string,
        updateCurrentValue: string,
        updateArrow: string,
        viewButton: string,
    },
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        whiteSpace: 'normal',
        height: '100%',
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previousValue: {
        color: colors.grey700,
        wordBreak: 'break-word',
    },
    currentValue: {
        color: colors.grey900,
        wordBreak: 'break-word',
    },
    updateArrow: {
        display: 'inline-flex',
        alignItems: 'center',
        margin: spacers.dp4,
    },
    viewButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: colors.grey800,
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
            textDecoration: 'underline',
            color: 'black',
        },
    },
};

export const ChangelogValueCellPlain = ({
    dataItemId,
    changeType,
    currentValue,
    previousValue,
    classes,
}: Props) => {
    if (!currentValue) { return null; }
    const isPolygon = dataItemId === 'geometry' && currentValue.length > 2;
    const ComponentsByChangeType = isPolygon
        ? PlygonChangelogComponentsByChangeType
        : DefaultChangelogComponentsByChangeType;

    const ChangelogComponent = ComponentsByChangeType[changeType];

    if (!ChangelogComponent) {
        console.error(`No component found for change type: ${changeType}`);
        return null;
    }

    return (
        <ChangelogComponent
            previousValue={previousValue}
            currentValue={currentValue}
            classes={classes}
        />
    );
};

export const ChangelogValueCell = withStyles(styles)(ChangelogValueCellPlain);
