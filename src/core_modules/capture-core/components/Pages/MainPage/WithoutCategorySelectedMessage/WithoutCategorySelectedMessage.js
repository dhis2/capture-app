// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { IncompleteSelectionsMessage } from '../../../IncompleteSelectionsMessage';

const styles = {
    incompleteMessageContainer: {
        marginTop: '10px',
    },
    incompleteMessageContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        textAlign: 'center',
    },
    incompleteMessageButton: {
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
        textDecoration: 'underline',
        '&:hover': {
            color: colors.grey900,
        },
    },
};

const WithoutCategorySelectedMessagePlain = ({ classes }) => (
    <div
        className={classes.incompleteMessageContainer}
        data-test={'without-category-selected-message'}
    >
        <IncompleteSelectionsMessage>
            <div className={classes.incompleteMessageContent}>
                <span>{i18n.t('Please select a category.')}</span>
            </div>
        </IncompleteSelectionsMessage>
    </div>
);

export const WithoutCategorySelectedMessage = withStyles(styles)(WithoutCategorySelectedMessagePlain);
