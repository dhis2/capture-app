// @flow
import React, { useCallback, useState, type ComponentType, useMemo } from 'react';
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
    onCancel,
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

    const stepContents = useMemo(() => {
        if (currentStep.id === NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_LINKED_ENTITY_METADATA.id) {
            return (
                <LinkedEntityMetadataSelectorFromTrackedEntity
                    relationshipTypes={relationshipTypes}
                    trackedEntityTypeId={trackedEntityTypeId}
                    programId={programId}
                    onSelectLinkedEntityMetadata={handleLinkedEntityMetadataSelection}
                />
            );
        }
        if (currentStep.id === NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_RETRIEVER_MODE.id) {
            return (
                <RetrieverModeSelector
                    onSearchSelected={handleSearchRetrieverModeSelected}
                    onNewSelected={handleNewRetrieverModeSelected}
                />
            );
        }

        // Steps below will be implemented by new PR
        /* if (currentStep.id === NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.FIND_EXISTING_LINKED_ENTITY.id) {
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
        } */

        return (
            <div>
                {i18n.t('Missing implementation step')}
            </div>
        );
    }, [
        currentStep.id,
        handleLinkedEntityMetadataSelection,
        handleNewRetrieverModeSelected,
        handleSearchRetrieverModeSelected,
        programId,
        relationshipTypes,
        trackedEntityTypeId,
    ]);

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
                {stepContents}
            </Widget>
        </div>
    );
};

export const NewTrackedEntityRelationshipComponent: ComponentType<Props> =
    withStyles(styles)(NewTrackedEntityRelationshipPlain);
