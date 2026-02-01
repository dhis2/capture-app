import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { shallowEqual, useSelector } from 'react-redux';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { IncompleteSelectionsMessage } from '../../../../IncompleteSelectionsMessage';
import { useProgramInfo } from '../../../../../hooks/useProgramInfo';

const styles: Readonly<any> = {
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
};

type OwnProps = {
    programId: string;
};

type Props = OwnProps & WithStyles<typeof styles>;

const WithoutCategorySelectedMessagePlain = ({ programId, classes }: Props) => {
    const { program } = useProgramInfo(programId);
    const { categories } = useSelector(({ currentSelections }: { currentSelections: any }) => ({
        categories: currentSelections.categories,
    }), shallowEqual);

    if (!program?.categoryCombination) {
        log.error(errorCreator(errorMessages.MISSING_CATEGORY)({ programId }));
        throw Error(i18n.t('An error has occurred. See log for details'));
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
