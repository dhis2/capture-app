// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
// $FlowFixMe
import { shallowEqual, useSelector } from 'react-redux';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { withStyles } from '@material-ui/core';
import { IncompleteSelectionsMessage } from '../../../IncompleteSelectionsMessage';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';

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
};

const errorMessages = {
    MISSING_CATEGORY: 'Missing or invalid category options',
    GENERIC_ERROR: 'An error has occured. See log for details',
};

const WithoutCategorySelectedMessagePlain = ({ programId, classes }) => {
    const { program } = useProgramInfo(programId);
    const { categories } = useSelector(({ currentSelections }) => ({
        categories: currentSelections.categories,
    }), shallowEqual);

    if (!program.categoryCombination) {
        log.error(errorCreator(errorMessages.MISSING_CATEGORY)({ programId }));
        throw Error(i18n.t(errorMessages.GENERIC_ERROR));
    }

    const programCategories = [...program.categoryCombination.categories.values()];
    const missingCategoriesInSelection = programCategories.filter(category => !categories || !categories[category.id]);
    const categoryDisplayName = missingCategoriesInSelection[0].name;

    return (
        <div
            className={classes.incompleteMessageContainer}
            data-test={'without-category-selected-message'}
        >
            <IncompleteSelectionsMessage>
                <div className={classes.incompleteMessageContent}>
                    <span>{i18n.t('Please select {{category}}.', {
                        category: categoryDisplayName,
                        interpolation: { escapeValue: false },
                    })}</span>
                </div>
            </IncompleteSelectionsMessage>
        </div>
    );
};

export const WithoutCategorySelectedMessage = withStyles(styles)(WithoutCategorySelectedMessagePlain);
