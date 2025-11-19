import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core';
import { LinkButton } from '../../../../Buttons/LinkButton.component';
import { NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS } from '../wizardSteps.const';
import type { PlainProps } from './breadcrumbs.types';

const styles = {
    container: {
        padding: `${spacers.dp8} 0`,
    },
};

const slashStyles = {
    slash: {
        padding: 5,
    },
};

type Props = PlainProps & WithStyles<typeof styles>;

const Slash = withStyles(slashStyles)(({ classes }: WithStyles<typeof slashStyles>) =>
    <span className={classes.slash}>/</span>);

const LinkedEntityMetadataSelectorStep = ({ currentStep, onNavigate, trackedEntityTypeName }) => {
    const initialText = i18n.t('New {{trackedEntityTypeName}} relationship', {
        trackedEntityTypeName: trackedEntityTypeName && trackedEntityTypeName.toLowerCase(),
    });
    return (currentStep.value > NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_LINKED_ENTITY_METADATA.value ?
        <LinkButton onClick={onNavigate}>{initialText}</LinkButton> :
        <span>{initialText}</span>);
};

const RetrieverModeStep = ({ currentStep, onNavigate, linkedEntityMetadataName }) => {
    if (currentStep.value < NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_RETRIEVER_MODE.value) {
        return null;
    }

    return (
        <>
            <Slash />
            {currentStep.value > NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_RETRIEVER_MODE.value ?
                <LinkButton onClick={onNavigate}>{linkedEntityMetadataName}</LinkButton> :
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
            <span>{stepText}</span>
        </>
    );
};

const BreadcrumbsPlain = ({
    currentStep,
    onNavigate,
    linkedEntityMetadataName,
    trackedEntityTypeName,
    classes,
}: Props) => (
    <div className={classes.container}>
        <LinkedEntityMetadataSelectorStep
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
