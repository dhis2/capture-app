import React, { useCallback, useState } from 'react';
import { Button, IconLegend16, colors, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { SingleSelectField } from 'capture-core/components/FormFields/New';
import { useCategoryOptionsLoader } from '../../DataEntryDhis2Helpers';

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
            content: String.raw`"\2022"`,
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

type Category = { id: string; displayName: string };

type Props = {
    comboDisplayName: string;
    categories: Array<Category>;
    initialSelection: Record<string, string>;
    orgUnitId?: string;
    saving?: boolean;
    onSave: (categoryOptionUids: ReadonlyArray<string>) => Promise<boolean>;
    onCancel: () => void;
};

const AttributeOptionComboEditPlain = ({
    classes,
    comboDisplayName,
    categories,
    initialSelection,
    orgUnitId,
    saving,
    onSave,
    onCancel,
}: Props & WithStyles<typeof styles>) => {
    const [selection, setSelection] = useState<Record<string, string>>(initialSelection);
    const loadedCategories = useCategoryOptionsLoader(categories, orgUnitId, false);

    const save = useCallback(async () => {
        if (saving) return;
        const values = categories.map(({ id }) => selection[id]).filter(Boolean);
        if (values.length !== categories.length) return;
        const success = await onSave(values);
        if (success) onCancel();
    }, [saving, categories, selection, onSave, onCancel]);

    const saveDisabled = categories.some(({ id }) => !selection[id]);

    return (
        <div className={classes.block} data-test="widget-enrollment-attribute-option-combo-edit">
            <div className={classes.header}>
                <span>
                    <IconLegend16 color={colors.grey600} />
                </span>
                {`${comboDisplayName}:`}
            </div>
            <div className={classes.editContainer}>
                {categories.map((category) => {
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
                    <Button primary small onClick={save} loading={saving} disabled={saveDisabled}>
                        {i18n.t('Save')}
                    </Button>
                    <Button secondary small onClick={onCancel} disabled={saving}>
                        {i18n.t('Cancel')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const AttributeOptionComboEdit = withStyles(styles)(AttributeOptionComboEditPlain);
