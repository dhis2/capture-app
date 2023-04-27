// @flow
import React, { useCallback, useState, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Widget } from '../../../Widget';
import { LinkButton } from '../../../Buttons/LinkButton.component';
import { Breadcrumbs } from './Breadcrumbs';
import { NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS } from './wizardSteps.const';
import {
    LinkedEntityMetadataSelectorFromTrackedEntity,
    type LinkedEntityMetadata,
} from './LinkedEntityMetadataSelector';
import { RetrieverModeSelector } from './RetrieverModeSelector';
import type { Props, PlainProps } from './NewTrackedEntityRelationship.types';
import { TrackedEntityFinder } from './TrackedEntityFinder';

/*
import { Button, IconSearch16, IconAdd16, spacers } from '@dhis2/ui';
import { NewTEIRelationshipStatuses } from '../WidgetTrackedEntityRelationship.const';
import { RelationshipTypeSelector } from './RelationshipTypeSelector/RelationshipTypeSelector';
import { creationModeStatuses } from './NewTrackedEntityRelationship.const';
import { TeiSearch } from './TeiSearch/TeiSearch.container';
import {
    TeiRelationshipSearchResults,
} from '../../Pages/NewRelationship/TeiRelationship/SearchResults/TeiRelationshipSearchResults.component';
*/

const styles = {
    container: {
        backgroundColor: '#FAFAFA',
        maxWidth: 900,
    },
    bar: {
        color: '#494949',
        padding: '8px',
        display: 'inline-block',
        fontSize: '14px',
        borderRadius: '4px',
        marginBottom: '10px',
        backgroundColor: '#E9EEF4',
    },
    linkText: {
        backgroundColor: 'transparent',
        fontSize: 'inherit',
        color: 'inherit',
    },
};

const NewTrackedEntityRelationshipPlain = ({
    relationshipTypes,
    trackedEntityTypeId,
    programId,
    // onSave,
    onCancel,
    getPrograms,
    getSearchGroups,
    getSearchGroupsAsync,
    classes,
}: PlainProps) => {
    const [currentStep, setCurrentStep] =
        useState(NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_LINKED_ENTITY_METADATA);
    const [selectedLinkedEntityMetadata: LinkedEntityMetadata, setSelectedLinkedEntityMetadata] = useState(undefined);

    const handleNavigation = useCallback(
        (destination: $Values<typeof NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS>) => {
            setCurrentStep(destination);
        }, []);

    const handleLinkedEntityMetadataSelection = useCallback((linkedEntityMetadata: LinkedEntityMetadata) => {
        setSelectedLinkedEntityMetadata(linkedEntityMetadata);
        setCurrentStep(NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_RETRIEVER_MODE);
    }, []);

    const handleSearchRetrieverModeSelected = useCallback(() =>
        setCurrentStep(NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.FIND_EXISTING_LINKED_ENTITY), []);
    const handleNewRetrieverModeSelected = useCallback(() =>
        setCurrentStep(NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.NEW_LINKED_ENTITY), []);

    const stepContents = {
        [NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_LINKED_ENTITY_METADATA.id]: () => (
            <LinkedEntityMetadataSelectorFromTrackedEntity
                relationshipTypes={relationshipTypes}
                trackedEntityTypeId={trackedEntityTypeId}
                programId={programId}
                onSelectLinkedEntityMetadata={handleLinkedEntityMetadataSelection}
            />
        ),
        [NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_RETRIEVER_MODE.id]: () => (
            <RetrieverModeSelector
                onSearchSelected={handleSearchRetrieverModeSelected}
                onNewSelected={handleNewRetrieverModeSelected}
            />
        ),
        [NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.FIND_EXISTING_LINKED_ENTITY.id]: () => {
            const {
                trackedEntityTypeId: linkedEntityTrackedEntityTypeId,
                programId: linkedEntityProgramId,
            // $FlowFixMe business logic dictates that we will have the linkedEntityMetadata at this step
            }: LinkedEntityMetadata = selectedLinkedEntityMetadata;

            return (
                <TrackedEntityFinder
                    trackedEntityTypeId={linkedEntityTrackedEntityTypeId}
                    defaultProgramId={linkedEntityProgramId}
                    getPrograms={getPrograms}
                    getSearchGroups={getSearchGroups}
                    getSearchGroupsAsync={getSearchGroupsAsync}
                />
            );
        },
    };

    return (
        <div className={classes.container}>
            <div className={classes.bar}>
                <LinkButton onClick={onCancel} className={classes.linkText}>
                    {i18n.t('Go back without saving relationship')}
                </LinkButton>
            </div>
            <Widget
                noncollapsible
                header={(
                    <Breadcrumbs
                        currentStep={currentStep}
                        onNavigate={handleNavigation}
                        linkedEntityMetadataName={selectedLinkedEntityMetadata?.name}
                    />
                )}
            >
                {stepContents[currentStep.id]()}
            </Widget>
        </div>
    );
};

export const NewTrackedEntityRelationshipComponent: ComponentType<Props> =
    withStyles(styles)(NewTrackedEntityRelationshipPlain);

/*

const NewTrackedEntityRelationshipComponentPlain = (props) => {
    if (pageStatus === NewTEIRelationshipStatuses.MISSING_RELATIONSHIP_TYPE) {
        return (
            <RelationshipTypeSelector
                {...PassOnProps}
            />
        );
    }

    if (pageStatus === NewTEIRelationshipStatuses.MISSING_CREATION_MODE) {
        return (
            <div className={classes.container}>
                <div className={classes.creationselector}>
                    <Button
                        className={classes.creationselector}
                        onClick={() => onSetCreationMode(creationModeStatuses.SEARCH)}
                    >
                        <IconSearch16 />
                        <p>{i18n.t('Link to an existing person')}</p>
                    </Button>
                    <Button className={classes.creationselector}>
                        <IconAdd16 />
                        <p>{i18n.t('Create new')}</p>
                    </Button>
                </div>
            </div>
        );
    }

    if (pageStatus === NewTEIRelationshipStatuses.LINK_TO_EXISTING) {
        return (
            <div className={classes.container}>
                <TeiSearch
                    resultsPageSize={5}
                    id="relationshipTeiSearch"
                    getResultsView={viewProps => (
                        <TeiRelationshipSearchResults
                            onAddRelationship={addRelationship}
                            {...viewProps}
                        />
                    )}
                />
            </div>
        );
    }

    return <p>{i18n.t('An error occurred')}</p>;
};

export const NewTrackedEntityRelationshipComponent = withStyles(styles)(NewTrackedEntityRelationshipComponentPlain);

  const handleAddRelationship = useCallback((linkedTei) => {
        if (selectedRelationshipType) {
            const {
                constraintSide,
                id,
            } = selectedRelationshipType;
            const linkedTeiConstraintSide: string = constraintSide !== 'from' ? 'from' : 'to';

            const serverData = {
                relationships: [{
                    relationshipType: id,
                    [constraintSide]: {
                        trackedEntity: teiId,
                    },
                    [linkedTeiConstraintSide]: {
                        trackedEntity: linkedTei,
                    },
                }],
            };

*/
