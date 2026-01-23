import type { ComponentType } from 'react';
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { colors } from '@dhis2/ui';
import { useOriginLabel } from './hooks/useOriginLabel';
import { BreadcrumbItem } from '../common/BreadcrumbItem';
import { RtlChevron } from '../../../utils/rtl';

export const breadcrumbsKeys = Object.freeze({
    MAIN_PAGE: 'mainPage',
    SEARCH_PAGE: 'searchPage',
    BULK_DATA_ENTRY: 'bulkDataEntry',
});

type PlainProps = {
    onBackToOriginPage: () => void;
    displayFrontPageList?: boolean;
    programId: string;
    page: keyof typeof breadcrumbsKeys;
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
}: PlainProps & WithStyles<typeof styles>) => {
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
                    onClick: () => undefined,
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
                    {index < breadcrumbItems.length - 1 && <RtlChevron color={colors.grey800} />}
                </React.Fragment>
            ))}
        </div>
    );
};

export const BulkDataEntryBreadcrumb = withStyles(styles)(BreadcrumbsPlain) as ComponentType<PlainProps>;
