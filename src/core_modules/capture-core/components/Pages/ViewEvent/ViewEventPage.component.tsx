import React, { useEffect } from 'react';
import i18n from '@dhis2/d2-i18n';
import { OrgUnitFetcher } from 'capture-core/components/OrgUnitFetcher';
import { useSelector } from 'react-redux';
import { ViewEvent } from './ViewEventComponent/ViewEvent.container';
import { ViewEventNewRelationshipWrapper } from './Relationship/ViewEventNewRelationshipWrapper.container';
import { TopBar } from './TopBar.container';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import { useLocationQuery } from '../../../utils/routing';
import { useStageLabel } from '../../../metaData';

type Props = {
    isUserInteractionInProgress: boolean,
    eventDetailsSection: any,
    showAddRelationship: boolean,
};

export const ViewEventPageComponent = ({ isUserInteractionInProgress, eventDetailsSection, showAddRelationship }: Props) => {
    useEffect(() => inMemoryFileStore.clear, []);
    const { orgUnitId } = useLocationQuery();
    const { selectedCategories, programId } = useSelector((state: any) => ({
        selectedCategories: state.currentSelections.categoriesMeta,
        programId: state.currentSelections.programId,
    }));

    const eventLabel = useStageLabel('event') ?? i18n.t('event');
    const relationshipLabel = i18n.t('relationship');

    return (
        <OrgUnitFetcher orgUnitId={orgUnitId}>
            <TopBar
                programId={programId}
                orgUnitId={orgUnitId}
                selectedCategories={selectedCategories}
                isUserInteractionInProgress={isUserInteractionInProgress}
                editEventMode={eventDetailsSection.showEditEvent}
                formIsOpen
            />
            {
                showAddRelationship ?
                    <ViewEventNewRelationshipWrapper
                        eventLabel={eventLabel}
                        relationshipLabel={relationshipLabel}
                    /> :
                    <ViewEvent
                        programId={programId}
                    />
            }
        </OrgUnitFetcher>
    );
};
