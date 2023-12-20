// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withTheme } from '@material-ui/core/styles';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import enrollmentClasses from './enrollment.module.css';
import { EnrollmentRegistrationEntry } from '../../../../../DataEntries';
import type { Props } from './dataEntryEnrollment.types';
import { useLocationQuery } from '../../../../../../utils/routing';

const NewEnrollmentRelationshipPlain =
    ({
        theme,
        onSave,
        onCancel,
        programId,
        duplicatesReviewPageSize,
        renderDuplicatesDialogActions,
        renderDuplicatesCardActions,
        ExistingUniqueValueDialogActions,
    }: Props) => {
        const { orgUnitId, teiId } = useLocationQuery();
        const fieldOptions = { theme, fieldLabelMediaBasedClass: enrollmentClasses.fieldLabelMediaBased };

        return (
            <EnrollmentRegistrationEntry
                id={DATA_ENTRY_ID}
                selectedScopeId={programId}
                orgUnitId={orgUnitId}
                teiId={teiId}
                fieldOptions={fieldOptions}
                saveButtonText={(trackedEntityTypeName: string) => i18n.t('Save new {{trackedEntityTypeName}} and link', {
                    trackedEntityTypeName,
                    interpolation: { escapeValue: false },
                })}
                onSave={onSave}
                onCancel={onCancel}
                duplicatesReviewPageSize={duplicatesReviewPageSize}
                renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                renderDuplicatesCardActions={renderDuplicatesCardActions}
                ExistingUniqueValueDialogActions={ExistingUniqueValueDialogActions}
            />
        );
    };

export const NewEnrollmentRelationship = withTheme()(NewEnrollmentRelationshipPlain);
