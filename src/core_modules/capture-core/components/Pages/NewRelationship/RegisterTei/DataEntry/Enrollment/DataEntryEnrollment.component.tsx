import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withTheme } from 'capture-core-utils/styles';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import enrollmentClasses from './enrollment.module.css';
import { EnrollmentRegistrationEntry } from '../../../../../DataEntries';
import type { Props } from './dataEntryEnrollment.types';
import { relatedStageActions } from '../../../../../WidgetRelatedStages';

const NewEnrollmentRelationshipPlain =
    ({
        theme,
        onSave,
        onCancel,
        programId,
        orgUnitId,
        duplicatesReviewPageSize,
        renderDuplicatesDialogActions,
        renderDuplicatesCardActions,
        ExistingUniqueValueDialogActions,
    }: Props) => {
        const fieldOptions = { theme, fieldLabelMediaBasedClass: enrollmentClasses.fieldLabelMediaBased };
        const relatedStageActionsOptions = {
            [relatedStageActions.ENTER_DATA]: {
                disabled: true,
                disabledMessage: i18n.t('Enter details now is not available when creating a relationship'),
            },
            [relatedStageActions.LINK_EXISTING_RESPONSE]: { hidden: true },
        };

        return (
            <EnrollmentRegistrationEntry
                id={DATA_ENTRY_ID}
                selectedScopeId={programId}
                orgUnitId={orgUnitId}
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
                relatedStageActionsOptions={relatedStageActionsOptions}
            />
        );
    };

export const NewEnrollmentRelationship = withTheme()(NewEnrollmentRelationshipPlain);
