import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withTheme } from 'capture-core-utils/styles';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import enrollmentClasses from './enrollment.module.css';
import { EnrollmentRegistrationEntry } from '../../../../../../DataEntries';
import type { Props } from './dataEntryEnrollment.types';
import { relatedStageActions } from '../../../../../../WidgetRelatedStages';
import { getTermLabel } from '../../../../../../../metaData';
import { tCustomTerm } from '../../../../../../../utils/tCustomTerm';

const NewEnrollmentRelationshipPlain =
    ({
        theme,
        onSave,
        onCancel,
        programId,
        inheritedAttributes,
        orgUnitId,
        duplicatesReviewPageSize,
        renderDuplicatesDialogActions,
        renderDuplicatesCardActions,
        ExistingUniqueValueDialogActions,
    }: Props) => {
        const fieldOptions = { theme, fieldLabelMediaBasedClass: enrollmentClasses.fieldLabelMediaBased };
        const relationshipLabel = getTermLabel('relationship', { programId });
        const relatedStageActionsOptions = {
            [relatedStageActions.ENTER_DATA]: {
                disabled: true,
                disabledMessage: tCustomTerm(
                    'Enter details now is not available when creating a {{relationshipLabel}}',
                    { relationshipLabel },
                ),
            },
            [relatedStageActions.LINK_EXISTING_RESPONSE]: { hidden: true },
        };

        return (
            <EnrollmentRegistrationEntry
                id={DATA_ENTRY_ID}
                selectedScopeId={programId}
                orgUnitId={orgUnitId}
                fieldOptions={fieldOptions}
                saveButtonText={trackedEntityTypeName => i18n.t('Save new {{trackedEntityTypeName}} and link', {
                    trackedEntityTypeName,
                    interpolation: { escapeValue: false },
                })}
                onSave={onSave}
                onCancel={onCancel}
                duplicatesReviewPageSize={duplicatesReviewPageSize}
                renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                renderDuplicatesCardActions={renderDuplicatesCardActions}
                ExistingUniqueValueDialogActions={ExistingUniqueValueDialogActions}
                trackedEntityInstanceAttributes={inheritedAttributes}
                relatedStageActionsOptions={relatedStageActionsOptions}
            />
        );
    };

export const NewEnrollmentRelationship = withTheme()(NewEnrollmentRelationshipPlain);
