import React, { useCallback, useMemo, useState } from 'react';
import { IconEdit16, IconLegend16, colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { EnrollmentAOCDetails, EnrollmentCategoryCombo } from '../enrollment.types';
import { AttributeOptionComboEdit } from './AttributeOptionComboEdit.component';

const styles = {
    block: {
        margin: `${spacersNum.dp8}px 0`,
        fontSize: '14px',
        color: colors.grey900,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: `${spacersNum.dp4}px`,
    },
    optionList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${spacersNum.dp4}px`,
        marginInlineStart: `${spacersNum.dp16 + spacersNum.dp4}px`,
        marginTop: `${spacersNum.dp4}px`,
    },
    optionRow: {
        display: 'flex',
        gap: `${spacersNum.dp4}px`,
        '&::before': {
            content: String.raw`"\2022"`,
            color: colors.grey500,
            marginInlineEnd: `${spacersNum.dp4}px`,
        },
    },
    optionLabel: {
        color: colors.grey700,
    },
    editButton: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: 'pointer',
        border: 'none',
        borderRadius: '3px',
        background: 'transparent',
        color: colors.grey600,
        padding: '1px',
        marginInlineStart: '2px',
        '&:focus': {
            outline: 'none',
            background: colors.grey200,
            color: colors.grey800,
        },
        '&:hover': {
            background: colors.grey200,
            color: colors.grey800,
        },
    },
};

type Props = {
    enrollmentAOCDetails?: EnrollmentAOCDetails;
    enrollmentCategoryCombo?: EnrollmentCategoryCombo;
    orgUnitId?: string;
    readOnly?: boolean;
    saving?: boolean;
    onSave: (categoryOptionUids: ReadonlyArray<string>) => Promise<boolean>;
};

const findOptionForCategory = (details: EnrollmentAOCDetails, categoryId: string) =>
    details.categoryOptions.find(o => o.categories?.some(c => c.id === categoryId));

const derivedInitialSelection = (
    details: EnrollmentAOCDetails,
    categories: ReadonlyArray<{ id: string }>,
) =>
    categories.reduce<Record<string, string>>((acc, category) => {
        const option = findOptionForCategory(details, category.id);
        if (option) acc[category.id] = option.id;
        return acc;
    }, {});

const AttributeOptionComboPlain = ({
    classes,
    enrollmentAOCDetails,
    enrollmentCategoryCombo,
    orgUnitId,
    readOnly,
    saving,
    onSave,
}: Props & WithStyles<typeof styles>) => {
    const [editMode, setEditMode] = useState(false);

    const exitEdit = useCallback(() => setEditMode(false), []);
    const openEdit = useCallback(() => setEditMode(true), []);

    const categories = useMemo(
        () => enrollmentCategoryCombo?.categories ?? [],
        [enrollmentCategoryCombo],
    );
    const initialSelection = useMemo(
        () => (enrollmentAOCDetails
            ? derivedInitialSelection(enrollmentAOCDetails, categories)
            : {}),
        [enrollmentAOCDetails, categories],
    );

    if (!enrollmentAOCDetails || !enrollmentCategoryCombo
        || enrollmentAOCDetails.categoryCombo?.isDefault) {
        return null;
    }

    if (editMode) {
        return (
            <AttributeOptionComboEdit
                comboDisplayName={enrollmentCategoryCombo.displayName}
                categories={categories}
                initialSelection={initialSelection}
                orgUnitId={orgUnitId}
                saving={saving}
                onSave={onSave}
                onCancel={exitEdit}
            />
        );
    }

    return (
        <div className={classes.block} data-test="widget-enrollment-attribute-option-combo">
            <div className={classes.header}>
                <span data-test="widget-enrollment-icon-attribute-option-combo">
                    <IconLegend16 color={colors.grey600} />
                </span>
                {`${enrollmentCategoryCombo.displayName}:`}
                {!readOnly && !saving && (
                    <button
                        type="button"
                        className={classes.editButton}
                        data-test="widget-enrollment-icon-edit-attribute-option-combo"
                        onClick={openEdit}
                    >
                        <IconEdit16 />
                    </button>
                )}
            </div>
            <div className={classes.optionList}>
                {categories.map((category) => {
                    const option = findOptionForCategory(enrollmentAOCDetails, category.id);
                    if (!option) return null;
                    return (
                        <div
                            key={category.id}
                            className={classes.optionRow}
                            data-test="widget-enrollment-attribute-option-combo-row"
                        >
                            <span className={classes.optionLabel}>{`${category.displayName}:`}</span>
                            <span>{option.displayName}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const AttributeOptionCombo = withStyles(styles)(AttributeOptionComboPlain);
