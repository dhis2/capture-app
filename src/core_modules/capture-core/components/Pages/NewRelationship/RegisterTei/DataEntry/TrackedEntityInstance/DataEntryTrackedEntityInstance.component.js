// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withTheme } from '@material-ui/core';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import teiClasses from './trackedEntityInstance.module.css';
import { TeiRegistrationEntry } from '../../../../../DataEntries';
import type { Props } from './dataEntryTrackedEntityInstance.types';
import { useCurrentOrgUnitId } from '../../../../../../hooks/useCurrentOrgUnitId';

const RelationshipTrackedEntityInstancePlain =
    ({
        theme,
        onSave,
        onCancel,
        teiRegistrationMetadata = {},
        duplicatesReviewPageSize,
        renderDuplicatesDialogActions,
        renderDuplicatesCardActions,
        ExistingUniqueValueDialogActions,
    }: Props) => {
        const orgUnitId = useCurrentOrgUnitId();
        const fieldOptions = { theme, fieldLabelMediaBasedClass: teiClasses.fieldLabelMediaBased };
        const { trackedEntityType } = teiRegistrationMetadata || {};
        const trackedEntityTypeNameLC = trackedEntityType.name.toLocaleLowerCase();

        return (
            // $FlowFixMe - flow error will be resolved when rewriting relationship metadata fetching
            <TeiRegistrationEntry
                id={DATA_ENTRY_ID}
                orgUnitId={orgUnitId}
                teiRegistrationMetadata={teiRegistrationMetadata}
                selectedScopeId={teiRegistrationMetadata.form.id}
                saveButtonText={i18n.t('Save new {{trackedEntityTypeName}} and link', {
                    trackedEntityTypeName: trackedEntityTypeNameLC, interpolation: { escapeValue: false },
                })}
                fieldOptions={fieldOptions}
                onSave={onSave}
                onCancel={onCancel}
                duplicatesReviewPageSize={duplicatesReviewPageSize}
                renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                renderDuplicatesCardActions={renderDuplicatesCardActions}
                ExistingUniqueValueDialogActions={ExistingUniqueValueDialogActions}
                orgUnit={{ id: orgUnitId }}
            />
        );
    };

export const RelationshipTrackedEntityInstance = withTheme()(RelationshipTrackedEntityInstancePlain);
