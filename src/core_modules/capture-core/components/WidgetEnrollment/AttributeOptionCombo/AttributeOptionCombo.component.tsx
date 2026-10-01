import React, { useCallback, useMemo, useState } from 'react';
import { Button, IconEdit16, IconLegend16, colors, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { SingleSelectField } from 'capture-core/components/FormFields/New';
import { useCategoryOptionsLoader } from '../../DataEntryDhis2Helpers';
import type { AttributeOptionComboDetails } from '../hooks/useAttributeOptionComboDetails';

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
            content: '"\\2022"',
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
    editContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${spacersNum.dp4}px`,
        marginInlineStart: `${spacersNum.dp16 + spacersNum.dp4}px`,
        marginTop: `${spacersNum.dp4}px`,
    },
    fieldRow: {
        display: 'flex',
        gap: `${spacersNum.dp4}px`,
        fontSize: '14px',
        color: colors.grey900,
        minWidth: 0,
        '&::before': {
            content: '"\\2022"',
            color: colors.grey500,
            marginInlineEnd: `${spacersNum.dp4}px`,
        },
    },
    fieldRowContent: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${spacersNum.dp4}px`,
        flex: 1,
        minWidth: 0,
    },
    fieldLabel: {
        color: colors.grey700,
    },
    inputField: {
        minWidth: 0,
        maxWidth: '260px',
    },
    buttonStrip: {
        display: 'flex',
        gap: `${spacersNum.dp4}px`,
        margin: `${spacersNum.dp4}px 0`,
    },
};

type Props = {
    attributeOptionComboDetails?: AttributeOptionComboDetails;
    enrollmentCategoryCombo?: {
        displayName: string;
        categories: Array<{ id: string; displayName: string }>;
    };
    orgUnitId?: string;
    readOnly?: boolean;
    saving?: boolean;
    onSave?: (categoryOptionUids: ReadonlyArray<string>) => Promise<boolean>;
};

const derivedInitialSelection = (
    details: AttributeOptionComboDetails,
    categories: ReadonlyArray<{ id: string }>,
) =>
    categories.reduce<Record<string, string>>((acc, category) => {
        const option = details.categoryOptions.find(o => o.categories?.some(c => c.id === category.id));
        if (option) acc[category.id] = option.id;
        return acc;
    }, {});

const AttributeOptionComboPlain = ({
    classes,
    attributeOptionComboDetails,
    enrollmentCategoryCombo,
    orgUnitId,
    readOnly,
    saving,
    onSave,
}: Props & WithStyles<typeof styles>) => {
    const [editMode, setEditMode] = useState(false);
    const [selection, setSelection] = useState<Record<string, string>>({});

    const editableCategories = useMemo(() => enrollmentCategoryCombo?.categories ?? [], [enrollmentCategoryCombo]);
    const loadedCategories = useCategoryOptionsLoader(editableCategories, orgUnitId, !editMode);

    const exitEdit = useCallback(() => {
        setEditMode(false);
        setSelection({});
    }, []);

    const openEdit = useCallback(() => {
        if (!attributeOptionComboDetails) return;
        setSelection(derivedInitialSelection(attributeOptionComboDetails, editableCategories));
        setEditMode(true);
    }, [attributeOptionComboDetails, editableCategories]);

    const saveEdit = useCallback(async () => {
        if (saving || !onSave) return;
        const values = editableCategories.map(({ id }) => selection[id]).filter(Boolean);
        if (values.length !== editableCategories.length) return;
        const success = await onSave(values);
        if (success) exitEdit();
    }, [saving, editableCategories, selection, onSave, exitEdit]);

    if (!attributeOptionComboDetails || !enrollmentCategoryCombo
        || attributeOptionComboDetails.categoryCombo?.isDefault) {
        return null;
    }

    if (editMode) {
        const saveDisabled = editableCategories.some(({ id }) => !selection[id]);
        return (
            <div className={classes.block} data-test="widget-enrollment-attribute-option-combo-edit">
                <div className={classes.header}>
                    <span>
                        <IconLegend16 color={colors.grey600} />
                    </span>
                    {`${enrollmentCategoryCombo.displayName}:`}
                </div>
                <div className={classes.editContainer}>
                    {editableCategories.map((category) => {
                        const loaded = loadedCategories?.find(c => c.id === category.id);
                        const options = (loaded?.options ?? [])
                            .filter(o => o.writeAccess || o.value === selection[category.id]);
                        return (
                            <div key={category.id} className={classes.fieldRow}>
                                <div className={classes.fieldRowContent}>
                                    <span className={classes.fieldLabel}>{category.displayName}</span>
                                    <div className={classes.inputField}>
                                        <SingleSelectField
                                            id={`enrollment-aoc-${category.id}`}
                                            value={selection[category.id] ?? null}
                                            options={options}
                                            onChange={value => setSelection(prev => ({
                                                ...prev,
                                                [category.id]: value ?? '',
                                            }))}
                                            filterable
                                            clearable={false}
                                            dense
                                            dataTest={`widget-enrollment-aoc-${category.id}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className={classes.buttonStrip}>
                        <Button
                            primary
                            small
                            onClick={saveEdit}
                            disabled={saveDisabled || saving}
                        >
                            {saving ? i18n.t('Saving…') : i18n.t('Save')}
                        </Button>
                        <Button
                            secondary
                            small
                            onClick={exitEdit}
                            disabled={saving}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.block} data-test="widget-enrollment-attribute-option-combo">
            <div className={classes.header}>
                <span data-test="widget-enrollment-icon-attribute-option-combo">
                    <IconLegend16 color={colors.grey600} />
                </span>
                {`${enrollmentCategoryCombo.displayName}:`}
                {!readOnly && !saving && onSave && (
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
                {editableCategories.map((category) => {
                    const option = attributeOptionComboDetails.categoryOptions
                        .find(o => o.categories?.some(c => c.id === category.id));
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
