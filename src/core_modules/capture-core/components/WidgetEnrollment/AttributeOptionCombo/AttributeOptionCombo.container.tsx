import React, { useMemo } from 'react';
import { useGroupedCategoryOptions } from '../../DataEntryDhis2Helpers/AOC/useGroupedCategoryOptions';
import { AttributeOptionCombo as AttributeOptionComboComponent } from './AttributeOptionCombo.component';
import type { EnrollmentCategoryOptionCombo, EnrollmentCategoryCombo } from '../enrollment.types';

type Props = {
    enrollmentAOCDetails?: EnrollmentCategoryOptionCombo;
    enrollmentCategoryCombo?: EnrollmentCategoryCombo;
    orgUnitId?: string;
    readOnly?: boolean;
    saving?: boolean;
    onSave: (categoryOptionUids: ReadonlyArray<string>) => Promise<boolean>;
};

export const AttributeOptionCombo = ({
    enrollmentAOCDetails,
    enrollmentCategoryCombo,
    orgUnitId,
    readOnly,
    saving,
    onSave,
}: Props) => {
    const categories = useMemo(
        () => enrollmentCategoryCombo?.categories ?? [],
        [enrollmentCategoryCombo],
    );

    const isEditable = Boolean(
        enrollmentCategoryCombo && !enrollmentCategoryCombo.isDefault && !readOnly,
    );
    const loadedCategories = useGroupedCategoryOptions(categories, orgUnitId, isEditable);

    if (!enrollmentCategoryCombo || enrollmentCategoryCombo.isDefault) {
        return null;
    }

    return (
        <AttributeOptionComboComponent
            enrollmentAOCDetails={enrollmentAOCDetails}
            enrollmentCategoryCombo={enrollmentCategoryCombo}
            categories={categories}
            loadedCategories={loadedCategories}
            readOnly={readOnly}
            saving={saving}
            onSave={onSave}
        />
    );
};
