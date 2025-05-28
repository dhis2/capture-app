// @flow
import type { ComponentType } from 'react';
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { colors, IconChevronRight16 } from '@dhis2/ui';
import { useOriginLabel } from './hooks/useOriginLabel';
import { BreadcrumbItem } from '../common/BreadcrumbItem';

export const breadcrumbsKeys = Object.freeze({
    MAIN_PAGE: 'mainPage',
    SEARCH_PAGE: 'searchPage',
    BULK_DATA_ENTRY: 'bulkDataEntry',
});

type Props = {
    onBackToOriginPage: () => void,
    displayFrontPageList?: boolean,
    programId: string,
    page: $Values<typeof breadcrumbsKeys>,
    ...CssClasses,
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
    },
};

const BreadcrumbsPlain = ({
    onBackToOriginPage,
    programId,
    displayFrontPageList,
    page,
    classes,
}: Props) => {
    const { label } = useOriginLabel({
        programId,
        displayFrontPageList,
        page,
    });

    const breadcrumbItems = useMemo(
        () =>
            [
                {
                    key: page,
                    onClick: onBackToOriginPage,
                    label,
                    selected: false,
                    condition: true,
                },
                {
                    key: breadcrumbsKeys.BULK_DATA_ENTRY,
                    onClick: () => {},
                    label: i18n.t('Bulk data entry'),
                    selected: true,
                    condition: true,
                },
            ].filter(item => item.condition),
        [label, onBackToOriginPage, page],
    );

    return (
        <div className={classes.container} data-test="bulkDataEntry-breadcrumb">
            {breadcrumbItems.map((button, index) => (
                <React.Fragment key={button.key}>
                    <BreadcrumbItem
                        label={button.label}
                        onClick={button.onClick}
                        selected={button.selected}
                        dataTest={`bulkDataEntry-breadcrumb-${button.key}-item`}
                    />
                    {index < breadcrumbItems.length - 1 && <IconChevronRight16 color={colors.grey800} />}
                </React.Fragment>
            ))}
        </div>
    );
};

export const BulkDataEntryBreadcrumb: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(BreadcrumbsPlain);
