// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { colors, spacers } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { SingleEventRegistrationEntry } from '../DataEntries';
import type { Props } from './EventRegistrationEntryWrapper.types';

const getStyles = () => ({
    container: {
        marginBottom: spacers.dp12,
        padding: spacers.dp16,
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
    title: {
        padding: '8px 0 0px 8px',
        fontWeight: 500,
        marginBottom: spacers.dp16,
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    flexItem: {
        flex: 1,
        minWidth: '500px',
    },
    noAccessContainer: {
        padding: spacers.dp16,
    },
});

const EventRegistrationEntryWrapperPlain = ({
    classes,
    selectedScopeId,
    dataEntryId,
    eventAccess,
}: Props) => {
    if (!eventAccess?.write) {
        return (
            <div className={classes.noAccessContainer}>
                {i18n.t('You don\'t have access to create an event in the current selections')}
            </div>
        );
    }

    return (
        <SingleEventRegistrationEntry
            id={dataEntryId}
            selectedScopeId={selectedScopeId}
        />
    );
};

export const EventRegistrationEntryWrapperComponent = withStyles(getStyles)(EventRegistrationEntryWrapperPlain);
