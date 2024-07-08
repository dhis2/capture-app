// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withTheme } from '@material-ui/core';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import teiClasses from './trackedEntityInstance.module.css';
import { TeiRegistrationEntry } from '../../../../../../DataEntries';
import type { Props } from './dataEntryTrackedEntityInstance.types';
import { getTeiRegistrationMetadata } from './tei.selectors';
import { useLocationQuery } from '../../../../../../../utils/routing';

const RelationshipTrackedEntityInstancePlain =
    ({
        theme,
        onSave,
        onCancel,
        trackedEntityTypeId,
        inheritedAttributes,
        duplicatesReviewPageSize,
        renderDuplicatesDialogActions,
        renderDuplicatesCardActions,
        ExistingUniqueValueDialogActions,
    }: Props) => {
        const { orgUnitId } = useLocationQuery();
        const fieldOptions = { theme, fieldLabelMediaBasedClass: teiClasses.fieldLabelMediaBased };
        const teiRegistrationMetadata = getTeiRegistrationMetadata(trackedEntityTypeId);
        const { trackedEntityType } = teiRegistrationMetadata || {};
        const trackedEntityTypeNameLC = trackedEntityType.name.toLocaleLowerCase();

        if (!teiRegistrationMetadata && !teiRegistrationMetadata?.form) {
            return null;
        }

        return (
            // $FlowFixMe - flow error will be resolved when rewriting relationship metadata fetching
            <TeiRegistrationEntry
                id={DATA_ENTRY_ID}
                orgUnitId={orgUnitId}
                teiRegistrationMetadata={teiRegistrationMetadata}
                selectedScopeId={teiRegistrationMetadata.form.id}
                inheritedAttributes={inheritedAttributes}
                onCancel={onCancel}
                saveButtonText={i18n.t('Save new {{trackedEntityTypeName}} and link', {
                    trackedEntityTypeName: trackedEntityTypeNameLC, interpolation: { escapeValue: false },
                })}
                fieldOptions={fieldOptions}
                onSave={onSave}
                duplicatesReviewPageSize={duplicatesReviewPageSize}
                renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                renderDuplicatesCardActions={renderDuplicatesCardActions}
                ExistingUniqueValueDialogActions={ExistingUniqueValueDialogActions}
                orgUnit={{ id: orgUnitId }}
            />
        );
    };

export const DataEntryTrackedEntityInstance = withTheme()(RelationshipTrackedEntityInstancePlain);
