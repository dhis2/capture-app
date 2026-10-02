import React, { useCallback, useState } from 'react';
import { Button, IconLegend16, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { SingleSelectField } from 'capture-core/components/FormFields/New';
import { useCategoryOptionsLoader } from '../../DataEntryDhis2Helpers';
import type { SharedClasses } from './AttributeOptionCombo.component';

type Category = { id: string; displayName: string };

type Props = {
    classes: SharedClasses;
    comboDisplayName: string;
    categories: Array<Category>;
    initialSelection: Record<string, string>;
    orgUnitId?: string;
    saving?: boolean;
    onSave: (categoryOptionUids: ReadonlyArray<string>) => Promise<boolean>;
    onCancel: () => void;
};

export const AttributeOptionComboEdit = ({
    classes,
    comboDisplayName,
    categories,
    initialSelection,
    orgUnitId,
    saving,
    onSave,
    onCancel,
}: Props) => {
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
            <div className={classes.rowList}>
                {categories.map((category) => {
                    const loaded = loadedCategories?.find(c => c.id === category.id);
                    const options = (loaded?.options ?? [])
                        .filter(o => o.writeAccess || o.value === selection[category.id]);
                    return (
                        <div key={category.id} className={classes.bulletRow}>
                            <div className={classes.fieldRowContent}>
                                <span className={classes.label}>{category.displayName}</span>
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
