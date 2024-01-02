// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch } from 'react-redux';
import { selectFindMode } from './TrackedEntityRelationshipsWrapper.actions';
import { useTEIRelationshipsWidgetMetadata } from '../useTEIRelationshipsWidgetMetadata';
import {
    WidgetTrackedEntityRelationship,
} from '../../../../WidgetsRelationship/WidgetTrackedEntityRelationship';
import type { OnSelectFindModeProps } from '../../../../WidgetsRelationship/WidgetTrackedEntityRelationship';
import type { Props } from './TrackedEntityRelationshipsWrapper.types';
import { TeiSearch } from '../TeiSearch/TeiSearch.container';
import {
    TeiRelationshipSearchResults,
} from '../../../NewRelationship/TeiRelationship/SearchResults/TeiRelationshipSearchResults.component';
import { ResultsPageSizeContext } from '../../../shared-contexts';
import { RegisterTei } from '../RegisterTei';
import { useCoreOrgUnit } from '../../../../../metadataRetrieval/coreOrgUnit';

export const TrackedEntityRelationshipsWrapper = ({
    trackedEntityTypeId,
    teiId,
    programId,
    orgUnitId,
    addRelationshipRenderElement,
    onOpenAddRelationship,
    onCloseAddRelationship,
    onLinkedRecordClick,
}: Props) => {
    const dispatch = useDispatch();
    const { relationshipTypes, isError } = useTEIRelationshipsWidgetMetadata();
    const { orgUnit } = useCoreOrgUnit(orgUnitId);
    const initialOrgUnit = orgUnit ? { id: orgUnitId, name: orgUnit.name, path: orgUnit.path } : null;

    const onSelectFindMode = ({ findMode, relationshipConstraint }: OnSelectFindModeProps) => {
        dispatch(selectFindMode({
            findMode,
            orgUnit: initialOrgUnit,
            relationshipConstraint,
        }));
    };

    if (isError) {
        return (
            <div>
                {i18n.t('Could not retrieve metadata. Please try again later.')}
            </div>
        );
    }

    if (!relationshipTypes?.length || !addRelationshipRenderElement) {
        return null;
    }

    return (
        <>
            <WidgetTrackedEntityRelationship
                programId={programId}
                trackedEntityTypeId={trackedEntityTypeId}
                teiId={teiId}
                orgUnitId={orgUnitId}
                onLinkedRecordClick={onLinkedRecordClick}
                addRelationshipRenderElement={addRelationshipRenderElement}
                onOpenAddRelationship={onOpenAddRelationship}
                onCloseAddRelationship={onCloseAddRelationship}
                // optional props
                onSelectFindMode={onSelectFindMode}
                relationshipTypes={relationshipTypes}
                renderTrackedEntityRegistration={(
                    selectedTrackedEntityTypeId,
                    suggestedProgramId,
                    onLinkToTrackedEntityFromRegistration,
                    onLinkToTrackedEntityFromSearch,
                    onCancel,
                ) => (
                    <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
                        <RegisterTei
                            suggestedProgramId={suggestedProgramId}
                            onLink={onLinkToTrackedEntityFromSearch}
                            onSave={onLinkToTrackedEntityFromRegistration}
                            teiId={teiId}
                            onGetUnsavedAttributeValues={() => console.log('get unsaved')}
                            trackedEntityTypeId={selectedTrackedEntityTypeId}
                            onCancel={onCancel}
                        />
                    </ResultsPageSizeContext.Provider>
                )}
                renderTrackedEntitySearch={(
                    searchTrackedEntityTypeId,
                    searchProgramId,
                    onLinkToTrackedEntityFromSearch,
                ) => (
                    <TeiSearch
                        resultsPageSize={5}
                        id="relationshipTeiSearchWidget"
                        selectedTrackedEntityTypeId={searchTrackedEntityTypeId}
                        getResultsView={viewProps => (
                            <TeiRelationshipSearchResults
                                onAddRelationship={onLinkToTrackedEntityFromSearch}
                                {...viewProps}
                            />
                        )}
                    />
                )}
            />
        </>
    );
};
