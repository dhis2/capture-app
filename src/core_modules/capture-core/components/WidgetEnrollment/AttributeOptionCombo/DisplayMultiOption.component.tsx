import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconEdit16, IconLegend16, colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { IconButton } from 'capture-ui';
import type { EnrollmentCategoryCombo, EnrollmentCategoryOptionCombo } from '../enrollment.types';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: `${spacersNum.dp4}px`,
    },
    rowList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${spacersNum.dp4}px`,
        marginInlineStart: `${spacersNum.dp16 + spacersNum.dp4}px`,
        marginTop: `${spacersNum.dp4}px`,
    },
    bulletTextRow: {
        paddingInlineStart: '1em',
        textIndent: '-1em',
        '&::before': {
            content: String.raw`"\2022  "`,
            color: colors.grey500,
            whiteSpace: 'pre' as const,
        },
    },
    label: {
        color: colors.grey700,
        whiteSpace: 'nowrap' as const,
        flexShrink: 0,
    },
};

type Props = {
    enrollmentCategoryCombo: EnrollmentCategoryCombo;
    categories: ReadonlyArray<{ id: string; displayName: string }>;
    enrollmentAOCDetails?: EnrollmentCategoryOptionCombo;
    canEdit: boolean;
    onEdit: () => void;
};

const findOptionForCategory = (details: EnrollmentCategoryOptionCombo | undefined, categoryId: string) =>
    details?.categoryOptions.find(o => o.categories.some(c => c.id === categoryId));

const DisplayMultiOptionPlain = ({
    classes,
    enrollmentCategoryCombo,
    categories,
    enrollmentAOCDetails,
    canEdit,
    onEdit,
}: Props & WithStyles<typeof styles>) => (
    <>
        <div className={classes.header}>
            <span data-test="widget-enrollment-icon-attribute-option-combo">
                <IconLegend16 color={colors.grey600} />
            </span>
            {`${enrollmentCategoryCombo.displayName}:`}
            {canEdit && (
                <IconButton
                    dataTest="widget-enrollment-icon-edit-attribute-option-combo"
                    aria-label={i18n.t('Edit {{label}}', { label: enrollmentCategoryCombo.displayName })}
                    onClick={onEdit}
                >
                    <IconEdit16 />
                </IconButton>
            )}
        </div>
        <div className={classes.rowList}>
            {categories.map((category) => {
                const option = findOptionForCategory(enrollmentAOCDetails, category.id);
                return (
                    <div
                        key={category.id}
                        className={classes.bulletTextRow}
                        data-test="widget-enrollment-attribute-option-combo-row"
                    >
                        <span className={classes.label}>{`${category.displayName}: `}</span>
                        {option?.displayName && <span>{option.displayName}</span>}
                    </div>
                );
            })}
        </div>
    </>
);

export const DisplayMultiOption = withStyles(styles)(DisplayMultiOptionPlain);
