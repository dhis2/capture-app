// @flow
import React from 'react';
import { withTheme } from '@material-ui/core/styles';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import enrollmentClasses from './enrollment.module.css';
import { EnrollmentRegistrationEntry } from '../../../../../DataEntries';
import type { Props } from './dataEntryEnrollment.types';

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


        return (
            <EnrollmentRegistrationEntry
                id={DATA_ENTRY_ID}
                selectedScopeId={programId}
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
