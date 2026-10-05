import React, { useCallback, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconEdit16, IconLegend16, colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { SingleSelectField } from 'capture-core/components/FormFields/New';
import { useGroupedCategoryOptions } from '../../DataEntryDhis2Helpers/AOC/useGroupedCategoryOptions';
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
        const newSelection: Record<string, string> = {};
        enrollmentAOCDetails?.categoryOptions.forEach((option) => {
            option.categories.forEach((cat) => { newSelection[cat.id] = option.id; });
        });
        setSelection(newSelection);
        setEditMode(true);
    }, [enrollmentAOCDetails]);
    const exitEdit = useCallback(() => setEditMode(false), []);

    const loadedCategories = useGroupedCategoryOptions(categories, orgUnitId, editMode);

    const save = useCallback(async () => {
        const values = categories.map(({ id }) => selection[id]);
        if (await onSave(values)) exitEdit();
    }, [categories, selection, onSave, exitEdit]);

    const saveDisabled = categories.some(({ id }) => !selection[id]);

    if (!enrollmentCategoryCombo || enrollmentCategoryCombo.isDefault) {
        return null;
    }

    const findOptionForCategory = (categoryId: string) => enrollmentAOCDetails?.categoryOptions
        .find(o => o.categories.some(c => c.id === categoryId));

    const canEdit = !editMode && !readOnly && !saving;
    const editButton = canEdit && (
        <Button
            small
            secondary
            icon={<IconEdit16 />}
            onClick={openEdit}
            dataTest="widget-enrollment-icon-edit-attribute-option-combo"
            aria-label={i18n.t('Edit {{label}}', { label: enrollmentCategoryCombo.displayName })}
        />
    );

    const multiCategory = categories.length > 1;

    if (categories.length === 1 && !editMode) {
        const option = findOptionForCategory(categories[0].id);
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
    }

    const getRowClass = () => {
        if (!multiCategory) return classes.row;
        return editMode ? classes.bulletRow : classes.bulletTextRow;
    };
    const rowClass = getRowClass();

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
                    const option = findOptionForCategory(category.id);
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
