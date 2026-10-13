import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconEdit16, IconLegend16, colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { IconButton } from 'capture-ui';
import type { EnrollmentCategoryCombo, EnrollmentCategoryOptionCombo } from '../enrollment.types';

type Option = EnrollmentCategoryOptionCombo['categoryOptions'][number];

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: `${spacersNum.dp4}px`,
    },
};

type Props = {
    enrollmentCategoryCombo: EnrollmentCategoryCombo;
    option?: Option;
    canEdit: boolean;
    onEdit: () => void;
};

const DisplaySingleOptionPlain = ({
    classes,
    enrollmentCategoryCombo,
    option,
    canEdit,
    onEdit,
}: Props & WithStyles<typeof styles>) => (
    <div className={classes.header}>
        <span data-test="widget-enrollment-icon-attribute-option-combo">
            <IconLegend16 color={colors.grey600} />
        </span>
        {`${enrollmentCategoryCombo.displayName}:`}
        {option?.displayName && <span>{option.displayName}</span>}
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
);

export const DisplaySingleOption = withStyles(styles)(DisplaySingleOptionPlain);
