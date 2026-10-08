import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconLegend16, colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { SingleSelectField } from 'capture-core/components/FormFields/New';
import type { LoadedCategory } from '../../DataEntryDhis2Helpers/AOC/useGroupedCategoryOptions';
import type { EnrollmentCategoryCombo } from '../enrollment.types';

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
    enrollmentCategoryCombo: EnrollmentCategoryCombo;
    categories: ReadonlyArray<{ id: string; displayName: string }>;
    loadedCategories: Array<LoadedCategory> | undefined;
    selection: Record<string, string>;
    onSelectionChange: (categoryId: string, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    saving?: boolean;
    saveDisabled: boolean;
};

const EditModePlain = ({
    classes,
    enrollmentCategoryCombo,
    categories,
    loadedCategories,
    selection,
    onSelectionChange,
    onSave,
    onCancel,
    saving,
    saveDisabled,
}: Props & WithStyles<typeof styles>) => {
    const multiCategory = categories.length > 1;
    const rowClass = multiCategory ? classes.bulletRow : classes.row;

    return (
        <>
            <div className={classes.header}>
                <span data-test="widget-enrollment-icon-attribute-option-combo">
                    <IconLegend16 color={colors.grey600} />
                </span>
                {`${enrollmentCategoryCombo.displayName}:`}
            </div>
            <div className={classes.rowList}>
                {categories.map(category => (
                    <div
                        key={category.id}
                        className={rowClass}
                        data-test="widget-enrollment-attribute-option-combo-row"
                    >
                        <div className={classes.fieldRowContent}>
                            {multiCategory && (
                                <span className={classes.label}>{`${category.displayName}:`}</span>
                            )}
                            <div className={classes.inputField}>
                                <SingleSelectField
                                    id={`enrollment-aoc-${category.id}`}
                                    value={selection[category.id] ?? null}
                                    options={loadedCategories?.find(c => c.id === category.id)?.options ?? []}
                                    onChange={value => onSelectionChange(category.id, value ?? '')}
                                    filterable
                                    clearable={false}
                                    dense
                                    dataTest={`widget-enrollment-aoc-${category.id}`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={classes.buttonStrip}>
                <Button primary small onClick={onSave} loading={saving} disabled={saveDisabled}>
                    {i18n.t('Save')}
                </Button>
                <Button secondary small onClick={onCancel} disabled={saving}>
                    {i18n.t('Cancel')}
                </Button>
            </div>
        </>
    );
};

export const EditMode = withStyles(styles)(EditModePlain);
