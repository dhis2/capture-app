import React, { useCallback, useMemo, useState } from 'react';
import { Button, IconEdit16, IconLegend16, colors, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { SingleSelectField } from 'capture-core/components/FormFields/New';
import { useCategoryOptionsLoader } from '../../DataEntryDhis2Helpers';
import type { AttributeOptionComboDetails } from '../hooks/useAttributeOptionComboDetails';

const styles = {
    row: {
        display: 'flex',
        alignItems: 'center',
        margin: `${spacersNum.dp8}px 0`,
        fontSize: '14px',
        color: colors.grey900,
        gap: `${spacersNum.dp4}px`,
    },
    editButton: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
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
        margin: `${spacersNum.dp8}px 0`,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${spacersNum.dp4}px`,
    },
    fieldRow: {
        display: 'flex',
        alignItems: 'center',
        gap: `${spacersNum.dp8}px`,
        fontSize: '14px',
        color: colors.grey900,
    },
    fieldLabel: {
        minWidth: '150px',
    },
    inputField: {
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
    orgUnitId?: string;
    readOnly?: boolean;
    saving?: boolean;
    onSave?: (categoryOptionUids: ReadonlyArray<string>) => void;
};

const derivedCategories = (details: AttributeOptionComboDetails) =>
    details.categoryOptions
        .map(option => option.categories?.[0])
        .filter((category): category is { id: string; displayName: string } => Boolean(category));

const derivedInitialSelection = (details: AttributeOptionComboDetails) =>
    details.categoryOptions.reduce<Record<string, string>>((acc, option) => {
        const categoryId = option.categories?.[0]?.id;
        if (categoryId) {
            acc[categoryId] = option.id;
        }
        return acc;
    }, {});

// If the currently-selected option isn't in the loaded (writable) options
// — e.g. its org unit scope changed, or read access was revoked — prepend a
// synthetic entry so the SingleSelectField shows its display name instead of
// the raw UID.
const buildOptionsForCategory = (
    categoryId: string,
    loadedOptions: Array<{ label: string; value: string; writeAccess: boolean }>,
    currentSelectionId: string | undefined,
    details: AttributeOptionComboDetails,
) => {
    const filtered = loadedOptions.filter(o => o.writeAccess || o.value === currentSelectionId);
    if (!currentSelectionId || filtered.some(o => o.value === currentSelectionId)) {
        return filtered;
    }
    const currentOption = details.categoryOptions.find(o => o.categories?.[0]?.id === categoryId);
    if (!currentOption) {
        return filtered;
    }
    return [{ label: currentOption.displayName, value: currentOption.id, writeAccess: false }, ...filtered];
};

const AttributeOptionComboPlain = ({
    classes,
    attributeOptionComboDetails,
    orgUnitId,
    readOnly,
    saving,
    onSave,
}: Props & WithStyles<typeof styles>) => {
    const [editMode, setEditMode] = useState(false);
    const [selection, setSelection] = useState<Record<string, string>>({});

    const editableCategories = useMemo(
        () => (attributeOptionComboDetails ? derivedCategories(attributeOptionComboDetails) : []),
        [attributeOptionComboDetails],
    );
    const loadedCategories = useCategoryOptionsLoader(editableCategories, orgUnitId, !editMode);

    const openEdit = useCallback(() => {
        if (!attributeOptionComboDetails) return;
        setSelection(derivedInitialSelection(attributeOptionComboDetails));
        setEditMode(true);
    }, [attributeOptionComboDetails]);

    const cancelEdit = useCallback(() => {
        setEditMode(false);
        setSelection({});
    }, []);

    const saveEdit = useCallback(() => {
        if (saving) return;
        const values = editableCategories.map(({ id }) => selection[id]).filter(Boolean);
        if (values.length === editableCategories.length && onSave) {
            onSave(values);
        }
        setEditMode(false);
    }, [saving, editableCategories, selection, onSave]);

    if (!attributeOptionComboDetails || attributeOptionComboDetails.categoryCombo?.isDefault) {
        return null;
    }

    if (editMode) {
        const saveDisabled = editableCategories.some(({ id }) => !selection[id]);
        return (
            <div className={classes.editContainer} data-test="widget-enrollment-attribute-option-combo-edit">
                {editableCategories.map((category) => {
                    const loaded = loadedCategories?.find(c => c.id === category.id);
                    const options = buildOptionsForCategory(
                        category.id,
                        loaded?.options ?? [],
                        selection[category.id],
                        attributeOptionComboDetails,
                    );
                    return (
                        <div key={category.id} className={classes.fieldRow}>
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
                                    dataTest={`widget-enrollment-aoc-${category.id}`}
                                />
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
                        onClick={cancelEdit}
                        disabled={saving}
                    >
                        {i18n.t('Cancel')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            {attributeOptionComboDetails.categoryOptions.map((option, index) => {
                const category = option.categories?.[0];
                const isFirst = index === 0;
                return (
                    <div
                        key={option.id}
                        className={classes.row}
                        data-test="widget-enrollment-attribute-option-combo"
                    >
                        <span data-test="widget-enrollment-icon-attribute-option-combo">
                            <IconLegend16 color={colors.grey600} />
                        </span>
                        {i18n.t('{{categoryName}}{{escape}}', {
                            categoryName: category?.displayName,
                            escape: ':',
                        })}
                        {option.displayName}
                        {isFirst && !readOnly && !saving && onSave && (
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
                );
            })}
        </>
    );
};

export const AttributeOptionCombo = withStyles(styles)(AttributeOptionComboPlain);
