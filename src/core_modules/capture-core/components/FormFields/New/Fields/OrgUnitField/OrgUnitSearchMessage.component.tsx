import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

export const ORG_UNIT_SEARCH_PAGE_SIZE = 15;

const styles = {
    message: {
        fontSize: '14px',
        color: colors.grey700,
        padding: `${spacers.dp8} ${spacers.dp12}`,
    },
} as const;

type Props = {
    resultCount: number;
} & WithStyles<typeof styles>;

const OrgUnitSearchMessagePlain = ({ resultCount, classes }: Props) => {
    if (resultCount === 0) {
        return (
            <div className={classes.message} data-test="org-unit-search-no-results">
                {i18n.t('No results found')}
            </div>
        );
    }
    if (resultCount >= ORG_UNIT_SEARCH_PAGE_SIZE) {
        return (
            <div className={classes.message} data-test="org-unit-search-more-results">
                {i18n.t('Showing the first {{pageSize}} results. Refine your search to find more.', {
                    pageSize: ORG_UNIT_SEARCH_PAGE_SIZE,
                })}
            </div>
        );
    }
    return null;
};

export const OrgUnitSearchMessage = withStyles(styles)(OrgUnitSearchMessagePlain);
