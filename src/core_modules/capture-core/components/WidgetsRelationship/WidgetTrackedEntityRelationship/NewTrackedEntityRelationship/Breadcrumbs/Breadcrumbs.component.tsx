import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core';
import { LinkButton } from '../../../../Buttons/LinkButton.component';
import { NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS } from '../wizardSteps.const';
import type { PlainProps } from './breadcrumbs.types';

const styles: Readonly<any> = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp8,
    },
};

type Props = PlainProps & WithStyles<typeof styles>;

const Slash = () => <span>/</span>;

const InitialStep = ({ currentStep, onNavigate, trackedEntityTypeName }) => {
    const initialText = i18n.t('New {{trackedEntityTypeName}} relationship', {
        trackedEntityTypeName: trackedEntityTypeName && trackedEntityTypeName.toLowerCase(),
    });
    return (currentStep.value > NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_LINKED_ENTITY_METADATA.value ?
        <LinkButton onClick={onNavigate}>{initialText as string}</LinkButton> :
        <span>{initialText as string}</span>);
};

const RetrieverModeStep = ({ currentStep, onNavigate, linkedEntityMetadataName }) => {
    if (currentStep.value < NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_RETRIEVER_MODE.value) {
        return null;
    }

    return (
        <>
            <Slash />
            {currentStep.value > NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_RETRIEVER_MODE.value ?
                <LinkButton onClick={onNavigate}>{linkedEntityMetadataName as string}</LinkButton> :
                <span>{linkedEntityMetadataName}</span>}
        </>
    );
};

const FindExistingStep = ({ currentStep }) => {
    const stepText = useMemo(() => {
        if (currentStep.id === NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.NEW_LINKED_ENTITY.id) {
            return i18n.t('Register');
        }
        if (currentStep.id === NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.FIND_EXISTING_LINKED_ENTITY.id) {
            return i18n.t('Search');
        }
        return null;
    }, [currentStep.id]);

    if (!stepText) {
        return null;
    }

    return (
        <>
            <Slash />
            <span>{stepText as string}</span>
        </>
    );
};

const BreadcrumbsPlain = ({
    currentStep,
    onNavigate,
    trackedEntityTypeName,
    linkedEntityMetadataName,
    classes,
}: Props) => (
    <div className={classes.container}>
        <InitialStep
            currentStep={currentStep}
            trackedEntityTypeName={trackedEntityTypeName}
            onNavigate={() =>
                onNavigate(NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_LINKED_ENTITY_METADATA)}
        />
        <RetrieverModeStep
            currentStep={currentStep}
            linkedEntityMetadataName={linkedEntityMetadataName}
            onNavigate={() => onNavigate(NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_RETRIEVER_MODE)}
        />
        <FindExistingStep
            currentStep={currentStep}
        />
    </div>
);

export const Breadcrumbs = withStyles(styles)(BreadcrumbsPlain);
