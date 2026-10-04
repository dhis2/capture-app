import React, { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconEdit16, IconLegend16, colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { SingleSelectField } from 'capture-core/components/FormFields/New';
import { useCategoryOptionsLoader } from '../../DataEntryDhis2Helpers';
import type { EnrollmentCategoryOptionCombo, EnrollmentCategoryCombo } from '../enrollment.types';

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
    rowList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${spacersNum.dp4}px`,
        marginInlineStart: `${spacersNum.dp16 + spacersNum.dp4}px`,
        marginTop: `${spacersNum.dp4}px`,
    },
    row: {
        display: 'flex',
        gap: `${spacersNum.dp4}px`,
    },
    bulletRow: {
        display: 'flex',
        gap: `${spacersNum.dp4}px`,
        '&::before': {
            content: String.raw`"\2022"`,
            color: colors.grey500,
            marginInlineEnd: `${spacersNum.dp4}px`,
        },
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

    useEffect(() => {
        if (!editMode || !loadedCategories) return;
        setSelection(prev => Object.fromEntries(
            Object.entries(prev).filter(([catId, selId]) =>
                loadedCategories.find(c => c.id === catId)
                    ?.options.find(o => o.value === selId)
                    ?.writeAccess,
            ),
        ));
    }, [editMode, loadedCategories]);

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

    const editButtonVisible = !editMode && !readOnly && !saving;
    const editButton = editButtonVisible ? (
        <button
            type="button"
            className={classes.editButton}
            data-test="widget-enrollment-icon-edit-attribute-option-combo"
            aria-label={i18n.t('Edit {{label}}', { label: enrollmentCategoryCombo.displayName })}
            onClick={openEdit}
        >
            <IconEdit16 />
        </button>
    ) : null;


    const singleCategory = categories.length === 1;

    const renderSingleCategoryView = () => {
        const option = enrollmentAOCDetails?.categoryOptions
            .find(o => o.categories?.some(c => c.id === categories[0].id));
        return (
            <div className={classes.block} data-test="widget-enrollment-attribute-option-combo">
                <div className={classes.header}>
                    <span data-test="widget-enrollment-icon-attribute-option-combo">
                        <IconLegend16 color={colors.grey600} />
                    </span>
                    {`${enrollmentCategoryCombo.displayName}:`}
                    {option?.displayName && <span>{option.displayName}</span>}
                    {editButton}
                </div>
            </div>
        );
    };

    if (singleCategory && !editMode) return renderSingleCategoryView();

    return (
        <div className={classes.block} data-test="widget-enrollment-attribute-option-combo">
            <div className={classes.header}>
                <span data-test="widget-enrollment-icon-attribute-option-combo">
                    <IconLegend16 color={colors.grey600} />
                </span>
                {`${enrollmentCategoryCombo.displayName}:`}
                {editButton}
            </div>
            <div className={classes.rowList}>
                {categories.map((category) => {
                    const option = enrollmentAOCDetails?.categoryOptions
                        .find(o => o.categories?.some(c => c.id === category.id));
                    const multiCategory = categories.length > 1;
                    let rowClass = classes.row;
                    if (multiCategory) {
                        rowClass = editMode ? classes.bulletRow : classes.bulletTextRow;
                    }
                    return (
                        <div
                            key={category.id}
                            className={rowClass}
                            data-test="widget-enrollment-attribute-option-combo-row"
                        >
                            {editMode ? (
                                <div className={classes.fieldRowContent}>
                                    {multiCategory && (
                                        <span className={classes.label}>{`${category.displayName}:`}</span>
                                    )}
                                    <div className={classes.inputField}>
                                        <SingleSelectField
                                            id={`enrollment-aoc-${category.id}`}
                                            value={selection[category.id] ?? null}
                                            options={loadedCategories?.find(c => c.id === category.id)?.options ?? []}
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
                            ) : (
                                <>
                                    {multiCategory && (
                                        <span className={classes.label}>{`${category.displayName}: `}</span>
                                    )}
                                    {option?.displayName && <span>{option.displayName}</span>}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
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
