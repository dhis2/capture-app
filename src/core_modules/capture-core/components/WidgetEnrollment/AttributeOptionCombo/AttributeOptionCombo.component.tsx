import React, { useCallback, useState } from 'react';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { LoadedCategory } from '../../DataEntryDhis2Helpers/AOC/useGroupedCategoryOptions';
import type { EnrollmentCategoryOptionCombo, EnrollmentCategoryCombo } from '../enrollment.types';
import { DisplaySingleOption } from './DisplaySingleOption.component';
import { DisplayMultiOption } from './DisplayMultiOption.component';
import { EditMode } from './EditMode.component';

const styles = {
    block: {
        margin: `${spacersNum.dp8}px 0`,
        fontSize: '14px',
        color: colors.grey900,
    },
};

type Props = {
    enrollmentAOCDetails?: EnrollmentCategoryOptionCombo;
    enrollmentCategoryCombo: EnrollmentCategoryCombo;
    categories: ReadonlyArray<{ id: string; displayName: string }>;
    loadedCategories: Array<LoadedCategory> | undefined;
    readOnly?: boolean;
    saving?: boolean;
    onSave: (categoryOptionUids: ReadonlyArray<string>) => Promise<boolean>;
};

const findOptionForCategory = (details: EnrollmentCategoryOptionCombo | undefined, categoryId: string) =>
    details?.categoryOptions.find(o => o.categories.some(c => c.id === categoryId));

const AttributeOptionComboPlain = ({
    classes,
    enrollmentAOCDetails,
    enrollmentCategoryCombo,
    categories,
    loadedCategories,
    readOnly,
    saving,
    onSave,
}: Props & WithStyles<typeof styles>) => {
    const [editMode, setEditMode] = useState(false);
    const [selection, setSelection] = useState<Record<string, string>>({});

    const openEdit = useCallback(() => {
        const newSelection: Record<string, string> = {};
        enrollmentAOCDetails?.categoryOptions.forEach((option) => {
            option.categories.forEach((cat) => { newSelection[cat.id] = option.id; });
        });
        setSelection(newSelection);
        setEditMode(true);
    }, [enrollmentAOCDetails]);
    const exitEdit = useCallback(() => setEditMode(false), []);

    const save = useCallback(async () => {
        const values = categories.map(({ id }) => selection[id]);
        if (await onSave(values)) exitEdit();
    }, [categories, selection, onSave, exitEdit]);

    const onSelectionChange = useCallback((categoryId: string, value: string) => {
        setSelection(prev => ({ ...prev, [categoryId]: value }));
    }, []);

    const canEdit = !editMode && !readOnly && !saving;
    const saveDisabled = categories.some(({ id }) => !selection[id]);

    const renderBody = () => {
        if (editMode) {
            return (
                <EditMode
                    enrollmentCategoryCombo={enrollmentCategoryCombo}
                    categories={categories}
                    loadedCategories={loadedCategories}
                    selection={selection}
                    onSelectionChange={onSelectionChange}
                    onSave={save}
                    onCancel={exitEdit}
                    saving={saving}
                    saveDisabled={saveDisabled}
                />
            );
        }
        if (categories.length === 1) {
            return (
                <DisplaySingleOption
                    enrollmentCategoryCombo={enrollmentCategoryCombo}
                    option={findOptionForCategory(enrollmentAOCDetails, categories[0].id)}
                    canEdit={canEdit}
                    onEdit={openEdit}
                />
            );
        }
        return (
            <DisplayMultiOption
                enrollmentCategoryCombo={enrollmentCategoryCombo}
                categories={categories}
                enrollmentAOCDetails={enrollmentAOCDetails}
                canEdit={canEdit}
                onEdit={openEdit}
            />
        );
    };

    return (
        <div className={classes.block} data-test="widget-enrollment-attribute-option-combo">
            {renderBody()}
        </div>
    );
};

export const AttributeOptionCombo = withStyles(styles)(AttributeOptionComboPlain);
