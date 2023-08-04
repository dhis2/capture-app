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
import type {
    OnLinkToTrackedEntity,
} from '../../../../WidgetsRelationship/WidgetTrackedEntityRelationship/WidgetTrackedEntityRelationship.types';
import { ResultsPageSizeContext } from '../../../shared-contexts';
import { RegisterTeiComponent } from '../RegisterTei/RegisterTei.component';
import { RegisterTei } from '../RegisterTei';

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

    const onSelectFindMode = ({ findMode, relationshipConstraint, orgUnitId }: OnSelectFindModeProps) => {
        dispatch(selectFindMode({ findMode, orgUnitId, relationshipConstraint }));
    };

    if (isError) {
        return (
            <div>
                {i18n.t('Could not retrieve metadata. Please try again later.')}
            </div>
        );
    }

    if (!relationshipTypes || !addRelationshipRenderElement) {
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
                    selectedTrackedEntityTypeId: string,
                    suggestedProgramId: string,
                ) => (
                    <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
                        {/* <RegisterTeiComponent
                            dataEntryId={'relationshipTeiRegistrationWidget'}
                            itemId={''}
                            trackedEntityName={'trackedEntityName'}
                            selectedProgramId={selectedProgramId}
                            trackedEntityTypeId={selectedTrackedEntityTypeId}
                            error={''}
                        /> */}
                        <RegisterTei
                            onLink={() => console.log('link')}
                            onSave={() => console.log('save')}
                            onGetUnsavedAttributeValues={() => console.log('get unsaved')}
                            trackedEntityTypeId={selectedTrackedEntityTypeId}
                        />
                    </ResultsPageSizeContext.Provider>
                )}
                renderTrackedEntitySearch={(
                    searchTrackedEntityTypeId: string,
                    searchProgramId: string,
                    onLinkToTrackedEntity: OnLinkToTrackedEntity,
                ) => (
                    <TeiSearch
                        resultsPageSize={5}
                        id="relationshipTeiSearchWidget"
                        selectedProgramId={searchProgramId}
                        selectedTrackedEntityTypeId={searchTrackedEntityTypeId}
                        getResultsView={viewProps => (
                            <TeiRelationshipSearchResults
                                onAddRelationship={onLinkToTrackedEntity}
                                {...viewProps}
                            />
                        )}
                    />
                )}
            />
        </>
    );
};
