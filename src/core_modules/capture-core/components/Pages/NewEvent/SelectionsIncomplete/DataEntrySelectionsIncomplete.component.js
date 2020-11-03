// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { InefficientSelectionsMessage } from '../../../InefficientSelectionsMessage';
import type { Props } from './DataEntrySelectionsIncomplete.types';

const getStyles = () => ({
    container: {
        padding: 24,
    },
    buttonRow: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingTop: 10,
        marginLeft: '-8px',
    },
});

const DataEntrySelectionsIncompletePlain = ({ classes, onCancel, isProgramSelected, isOrgUnitSelected }) => {
    const getText = () => {
        if (!isProgramSelected && !isOrgUnitSelected) {
            return i18n.t('Select a registering unit and program above to get started');
        } else if (!isProgramSelected) {
            return i18n.t('Select a program to start reporting');
        } else if (!isOrgUnitSelected) {
            return i18n.t('Select a registering unit to start reporting');
        }
        return i18n.t('Select a category option to start reporting');
    };
    return (
        <div className={classes.container}>
            <InefficientSelectionsMessage message={getText()} />
            <div
                className={classes.buttonRow}
            >
                <Button
                    dataTest="dhis2-capture-new-page-cancel-button"
                    variant="text"
                    color="primary"
                    onClick={onCancel}
                >
                    {i18n.t('Cancel')}
                </Button>
            </div>
        </div>
    );
};

export const DataEntrySelectionsIncompleteComponent: ComponentType<$Diff<Props, CssClasses>> =
  withStyles(getStyles)(DataEntrySelectionsIncompletePlain);
