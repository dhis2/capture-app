import React, { useCallback, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconEdit16, IconLegend16, colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { SingleSelectField } from 'capture-core/components/FormFields/New';
import { useCategoryOptionsLoader } from '../../DataEntryDhis2Helpers';
import type { EnrollmentCategoryOptionCombo, EnrollmentCategoryCombo } from '../enrollment.types';

const styles = {
    block: {
        margin: `${spacersNum.dp8}px 0`,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: `${spacersNum.dp4}px`,
    },
    rowList: {
        listStyle: 'disc',
        paddingInlineStart: `${spacersNum.dp16 + spacersNum.dp4}px`,
        margin: `${spacersNum.dp4}px 0 0`,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${spacersNum.dp4}px`,
    },
    bulletRow: {
        display: 'flex',
        gap: `${spacersNum.dp4}px`,
        '&::marker': {
            color: colors.grey500,
        },
    },
    label: {
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
    fieldRowContent: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${spacersNum.dp4}px`,
        flex: 1,
        minWidth: 0,
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
    enrollmentAOCDetails?: EnrollmentCategoryOptionCombo;
    enrollmentCategoryCombo?: EnrollmentCategoryCombo;
    orgUnitId?: string;
    readOnly?: boolean;
    saving?: boolean;
    onSave: (categoryOptionUids: ReadonlyArray<string>) => Promise<boolean>;
};

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
    const [selection, setSelection] = useState<Record<string, string>>({});

    const categories = useMemo(
        () => enrollmentCategoryCombo?.categories ?? [],
        [enrollmentCategoryCombo],
    );

    const openEdit = useCallback(() => {
        const sel: Record<string, string> = {};
        enrollmentAOCDetails?.categoryOptions.forEach((option) => {
            option.categories?.forEach((cat) => { sel[cat.id] = option.id; });
        });
        setSelection(sel);
        setEditMode(true);
    }, [enrollmentAOCDetails]);
    const exitEdit = useCallback(() => setEditMode(false), []);

    const loadedCategories = useCategoryOptionsLoader(categories, orgUnitId, !editMode);

    const save = useCallback(async () => {
        if (saving) return;
        const values = categories.map(({ id }) => selection[id]).filter(Boolean);
        if (values.length !== categories.length) return;
        const success = await onSave(values);
        if (success) exitEdit();
    }, [saving, categories, selection, onSave, exitEdit]);

    const saveDisabled = categories.some(({ id }) => !selection[id]);

    if (!enrollmentCategoryCombo || enrollmentCategoryCombo.isDefault) {
        return null;
    }

    return (
        <div className={classes.block} data-test="widget-enrollment-attribute-option-combo">
            <div className={classes.header}>
                <span data-test="widget-enrollment-icon-attribute-option-combo">
                    <IconLegend16 color={colors.grey600} />
                </span>
                {`${enrollmentCategoryCombo.displayName}:`}
                {!editMode && !readOnly && !saving && (
                    <button
                        type="button"
                        className={classes.editButton}
                        data-test="widget-enrollment-icon-edit-attribute-option-combo"
                        aria-label={i18n.t('Edit {{label}}', { label: enrollmentCategoryCombo.displayName })}
                        onClick={openEdit}
                    >
                        <IconEdit16 />
                    </button>
                )}
            </div>
            <ul className={classes.rowList}>
                {editMode
                    ? categories.map(category => (
                        <li
                            key={category.id}
                            className={classes.bulletRow}
                            data-test="widget-enrollment-attribute-option-combo-row"
                        >
                            <div className={classes.fieldRowContent}>
                                <span className={classes.label}>{category.displayName}</span>
                                <div className={classes.inputField}>
                                    <SingleSelectField
                                        id={`enrollment-aoc-${category.id}`}
                                        value={selection[category.id] ?? null}
                                        options={(loadedCategories?.find(c => c.id === category.id)?.options ?? [])
                                            .filter(o => o.writeAccess || o.value === selection[category.id])}
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
                        </li>
                    ))
                    : enrollmentAOCDetails?.categoryOptions.map((option) => {
                        const category = option.categories?.[0];
                        if (!category) return null;
                        return (
                            <li
                                key={option.id}
                                className={classes.bulletRow}
                                data-test="widget-enrollment-attribute-option-combo-row"
                            >
                                <span className={classes.label}>{`${category.displayName}:`}</span>
                                <span>{option.displayName}</span>
                            </li>
                        );
                    })}
            </ul>
            {editMode && (
                <div className={classes.buttonStrip}>
                    <Button primary small onClick={save} loading={saving} disabled={saveDisabled}>
                        {i18n.t('Save')}
                    </Button>
                    <Button secondary small onClick={exitEdit} disabled={saving}>
                        {i18n.t('Cancel')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export const AttributeOptionCombo = withStyles(styles)(AttributeOptionComboPlain);
