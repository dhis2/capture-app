// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withTheme } from '@material-ui/core/styles';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import enrollmentClasses from './enrollment.module.css';
import { EnrollmentRegistrationEntry } from '../../../../../DataEntries';
import type { Props } from './dataEntryEnrollment.types';
import { useMetadataForRegistrationForm } from '../../../../../../hooks/useMetadataForRegistrationForm';

const NewEnrollmentRelationshipPlain =
    ({
        theme,
        onSave,
        programId,
        duplicatesReviewPageSize,
        renderDuplicatesDialogActions,
        renderDuplicatesCardActions,
        ExistingUniqueValueDialogActions,
    }: Props) => {
        const fieldOptions = { theme, fieldLabelMediaBasedClass: enrollmentClasses.fieldLabelMediaBased };
        const {
            registrationMetaData,
            formId,
            formFoundation,
        } = useMetadataForRegistrationForm({ selectedScopeId: programId });
        const trackedEntityTypeNameLC = registrationMetaData?.trackedEntityType?.name.toLocaleLowerCase();

        return (
            <EnrollmentRegistrationEntry
                id={DATA_ENTRY_ID}
                enrollmentMetadata={registrationMetaData}
                formFoundation={formFoundation}
                formId={formId}
                selectedScopeId={programId}
                saveButtonText={i18n.t('Save new {{trackedEntityTypeName}} and link', {
                    trackedEntityTypeName: trackedEntityTypeNameLC,
                    interpolation: { escapeValue: false },
                })}
                fieldOptions={fieldOptions}
                onSave={onSave}
                duplicatesReviewPageSize={duplicatesReviewPageSize}
                renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                renderDuplicatesCardActions={renderDuplicatesCardActions}
                ExistingUniqueValueDialogActions={ExistingUniqueValueDialogActions}
            />
        );
    };

export const NewEnrollmentRelationship = withTheme()(NewEnrollmentRelationshipPlain);
