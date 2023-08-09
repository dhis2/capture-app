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

export const TrackedEntityRelationshipsWrapper = ({
    trackedEntityTypeId,
    teiId,
    programId,
    addRelationshipRenderElement,
    onOpenAddRelationship,
    onCloseAddRelationship,
    onLinkedRecordClick,
}: Props) => {
    const dispatch = useDispatch();
    const { relationshipTypes, isError } = useTEIRelationshipsWidgetMetadata();

    const onSelectFindMode = ({ findMode, relationshipConstraint }: OnSelectFindModeProps) => {
        dispatch(selectFindMode({ findMode, relationshipConstraint }));
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
                onLinkedRecordClick={onLinkedRecordClick}
                addRelationshipRenderElement={addRelationshipRenderElement}
                onOpenAddRelationship={onOpenAddRelationship}
                onCloseAddRelationship={onCloseAddRelationship}
                // optional props
                onSelectFindMode={onSelectFindMode}
                relationshipTypes={relationshipTypes}
                renderTrackedEntitySearch={(
                    searchTrackedEntityTypeId: string,
                    searchProgramId: string,
                    onLinkToTrackedEntity: OnLinkToTrackedEntity,
                ) => (
                    <TeiSearch
                        resultsPageSize={5}
                        id="relationshipTeiSearchWidget"
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
