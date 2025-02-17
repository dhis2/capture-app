// @flow
import React, { useEffect } from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { OrgUnitFetcher } from 'capture-core/components/OrgUnitFetcher';
import { useSelector } from 'react-redux';
import { ViewEvent } from './ViewEventComponent/ViewEvent.container';
import { ViewEventNewRelationshipWrapper } from './Relationship/ViewEventNewRelationshipWrapper.container';
import { TopBar } from './TopBar.container';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';

type Props = {
  isUserInteractionInProgress: boolean,
  showAddRelationship: boolean,
  isReadOnly: boolean,
};

export const ViewEventPageComponent = ({ isUserInteractionInProgress, showAddRelationship, isReadOnly }: Props) => {
    const { serverVersion: { minor } } = useConfig();
    useEffect(() => inMemoryFileStore.clear, []);

    const { selectedCategories, programId, orgUnitId } = useSelector(({ currentSelections }) => ({
        selectedCategories: currentSelections.categoriesMeta,
        programId: currentSelections.programId,
        orgUnitId: currentSelections.orgUnitId,
    }));

    return (
        <div>
            <TopBar
                programId={programId}
                orgUnitId={orgUnitId}
                selectedCategories={selectedCategories}
                isReadOnly={isReadOnly}
                isUserInteractionInProgress={isUserInteractionInProgress}
                formIsOpen
            />
            <OrgUnitFetcher orgUnitId={orgUnitId}>
                {
                    showAddRelationship ?
                        <ViewEventNewRelationshipWrapper /> :
                        <ViewEvent
                            programId={programId}
                            serverMinorVersion={minor}
                        />
                }
            </OrgUnitFetcher>
        </div>
    );
};
