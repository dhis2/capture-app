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
import type { ComponentProps, StyledComponentProps } from './NewTrackedEntityRelationship.types';
import { useAddRelationship } from './hooks/useAddRelationship';
import { TARGET_SIDES } from './common';
import { generateUID } from '../../../../utils/uid/generateUID';

const styles = {
    container: {
        backgroundColor: '#FAFAFA',
        maxWidth: 1200,
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
    teiId,
    trackedEntityTypeName,
    orgUnitId,
    onCancel,
    onSave,
    renderTrackedEntitySearch,
    renderTrackedEntityRegistration,
    onSelectFindMode,
    classes,
}: StyledComponentProps) => {
    const [currentStep, setCurrentStep] =
        useState(NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_LINKED_ENTITY_METADATA);
    const [selectedLinkedEntityMetadata: LinkedEntityMetadata, setSelectedLinkedEntityMetadata] = useState(undefined);
    const { addRelationship } = useAddRelationship({
        teiId,
        onMutate: () => onSave && onSave(),
    });


    const onLinkToTrackedEntityFromSearch = useCallback(
        (linkedTrackedEntityId: string, attributes?: { [attributeId: string]: string }) => {
            if (!selectedLinkedEntityMetadata) return;
            const { relationshipId: relationshipTypeId, targetSide } = selectedLinkedEntityMetadata;
            const relationshipId = generateUID();

            const apiData = targetSide === TARGET_SIDES.TO ?
                { from: { trackedEntity: { trackedEntity: teiId } }, to: { trackedEntity: { trackedEntity: linkedTrackedEntityId } } } :
                { from: { trackedEntity: { trackedEntity: linkedTrackedEntityId } }, to: { trackedEntity: { trackedEntity: teiId } } };

            const clientData = {
                createdAt: new Date().toISOString(),
                pendingApiResponse: true,
                ...apiData,
            };

            if (attributes) {
                const targetSideLC = targetSide.toLowerCase();
                clientData[targetSideLC].trackedEntity = {
                    ...clientData[targetSideLC].trackedEntity,
                    attributes: Object.keys(attributes).map(attributeId => ({
                        attribute: attributeId,
                        value: attributes[attributeId],
                    })),
                };
            }

            addRelationship({
                apiData: {
                    relationships: [{
                        relationshipType: relationshipTypeId,
                        relationship: relationshipId,
                        ...apiData,
                    }],
                },
                clientRelationship: {
                    relationshipType: relationshipTypeId,
                    relationship: relationshipId,
                    ...clientData,
                },
            });
        }, [addRelationship, selectedLinkedEntityMetadata, teiId]);

    const onLinkToTrackedEntityFromRegistration = useCallback((trackedEntity: Object) => {
        if (!selectedLinkedEntityMetadata) return;
        const { relationshipId: relationshipTypeId, targetSide } = selectedLinkedEntityMetadata;
        const relationshipId = generateUID();

        const relationshipData = targetSide === TARGET_SIDES.TO ?
            { from: { trackedEntity: { trackedEntity: teiId } }, to: { trackedEntity: { trackedEntity: trackedEntity.trackedEntity } } } :
            { from: { trackedEntity: { trackedEntity: trackedEntity.trackedEntity } }, to: { trackedEntity: { trackedEntity: teiId } } };

        const clientData = {
            relationship: relationshipId,
            relationshipType: relationshipTypeId,
            createdAt: new Date().toISOString(),
            pendingApiResponse: true,
            ...relationshipData,
            [targetSide.toLowerCase()]: {
                trackedEntity: {
                    attributes: trackedEntity.attributes ?? trackedEntity.enrollments?.[0]?.attributes,
                    orgUnitId: trackedEntity.orgUnit,
                    trackedEntity: trackedEntity.trackedEntity,
                    trackedEntityType: trackedEntity.trackedEntityType,
                },
            },
        };

        const payload = {
            apiData: {
                trackedEntities: [trackedEntity],
                relationships: [{
                    relationship: relationshipId,
                    relationshipType: relationshipTypeId,
                    ...relationshipData,
                }],
            },
            clientRelationship: clientData,
        };

        addRelationship(payload);
    }, [addRelationship, selectedLinkedEntityMetadata, teiId]);

    const handleNavigation = useCallback(
        (destination: $Values<typeof NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS>) => {
            setCurrentStep(destination);
        }, []);

    const handleLinkedEntityMetadataSelection = useCallback((linkedEntityMetadata: LinkedEntityMetadata) => {
        setSelectedLinkedEntityMetadata(linkedEntityMetadata);
        setCurrentStep(NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_RETRIEVER_MODE);
    }, []);

    const handleSearchRetrieverModeSelected = useCallback(() => {
        if (selectedLinkedEntityMetadata) {
            onSelectFindMode && onSelectFindMode({
                findMode: 'TEI_SEARCH',
                orgUnitId,
                relationshipConstraint: {
                    programId: selectedLinkedEntityMetadata?.programId,
                    trackedEntityTypeId: selectedLinkedEntityMetadata.trackedEntityTypeId,
                },
            });
        }
        setCurrentStep(NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.FIND_EXISTING_LINKED_ENTITY);
    }, [onSelectFindMode, orgUnitId, selectedLinkedEntityMetadata]);

    const handleNewRetrieverModeSelected = useCallback(() => {
        if (selectedLinkedEntityMetadata) {
            onSelectFindMode && onSelectFindMode({
                findMode: 'TEI_REGISTER',
                orgUnitId,
                relationshipConstraint: {
                    programId: selectedLinkedEntityMetadata?.programId,
                    trackedEntityTypeId: selectedLinkedEntityMetadata.trackedEntityTypeId,
                },
            });
        }
        setCurrentStep(NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.NEW_LINKED_ENTITY);
    }, [onSelectFindMode, orgUnitId, selectedLinkedEntityMetadata]);


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
        if (
            currentStep.id === NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_RETRIEVER_MODE.id
            && selectedLinkedEntityMetadata?.trackedEntityName
        ) {
            return (
                <RetrieverModeSelector
                    onSearchSelected={handleSearchRetrieverModeSelected}
                    onNewSelected={handleNewRetrieverModeSelected}
                    trackedEntityName={selectedLinkedEntityMetadata.trackedEntityName}
                />
            );
        }

        // Steps below will be implemented by new PR
        if (currentStep.id === NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.FIND_EXISTING_LINKED_ENTITY.id) {
            const {
                trackedEntityTypeId: linkedEntityTrackedEntityTypeId,
                programId: linkedEntityProgramId,
                // $FlowFixMe business logic dictates that we will have the linkedEntityMetadata at this step
            }: LinkedEntityMetadata = selectedLinkedEntityMetadata;

            if (renderTrackedEntitySearch) {
                return renderTrackedEntitySearch(
                    linkedEntityTrackedEntityTypeId,
                    linkedEntityProgramId,
                    onLinkToTrackedEntityFromSearch,
                );
            }
        }

        if (currentStep.id === NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.NEW_LINKED_ENTITY.id) {
            const {
                trackedEntityTypeId: linkedEntityTrackedEntityTypeId,
                programId: linkedEntityProgramId,
                // $FlowFixMe business logic dictates that we will have the linkedEntityMetadata at this step
            }: LinkedEntityMetadata = selectedLinkedEntityMetadata;

            if (renderTrackedEntityRegistration) {
                return renderTrackedEntityRegistration(
                    linkedEntityTrackedEntityTypeId,
                    linkedEntityProgramId,
                    onLinkToTrackedEntityFromRegistration,
                    onLinkToTrackedEntityFromSearch,
                    onCancel,
                );
            }
        }

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
        onCancel,
        onLinkToTrackedEntityFromRegistration,
        onLinkToTrackedEntityFromSearch,
        programId,
        relationshipTypes,
        renderTrackedEntityRegistration,
        renderTrackedEntitySearch,
        selectedLinkedEntityMetadata,
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
                        trackedEntityTypeName={trackedEntityTypeName}
                    />
                )}
            >
                {stepContents}
            </Widget>
        </div>
    );
};

export const NewTrackedEntityRelationshipComponent: ComponentType<ComponentProps> =
    withStyles(styles)(NewTrackedEntityRelationshipPlain);
