import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS } from '../wizardSteps.const';
import type { PlainProps } from './breadcrumbs.types';

const styles = {
    container: {
        padding: `${spacers.dp8} 0`,
    },
};

const breadcrumblinkStyles = {
    link: {
        color: colors.grey800,
        padding: 0,
        fontSize: '14px',
        border: 'none',
        background: 'transparent',
        '&:hover': {
            color: colors.grey900,
            textDecoration: 'underline',
            cursor: 'pointer',
        },
    },
};

const slashStyles = {
    slash: {
        padding: 5,
    },
};

type Props = PlainProps & WithStyles<typeof styles>;

const Breadcrumblink = withStyles(breadcrumblinkStyles)(
    ({ classes, onClick, children }: { classes: any; onClick: () => void; children: React.ReactNode }) =>
        <button className={classes.link} onClick={onClick}>{children}</button>,
);

const Slash = withStyles(slashStyles)(({ classes }: WithStyles<typeof slashStyles>) =>
    <span className={classes.slash}>/</span>);

const LinkedEntityMetadataSelectorStep = ({ currentStep, onNavigate, trackedEntityTypeName }: any) => {
    const initialText = i18n.t('New {{trackedEntityTypeName}} relationship', {
        trackedEntityTypeName: trackedEntityTypeName && trackedEntityTypeName.toLowerCase(),
    });
    return (currentStep.value > NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS.SELECT_LINKED_ENTITY_METADATA.value ?
        <Breadcrumblink onClick={onNavigate}>{initialText}</Breadcrumblink> :
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
                <Breadcrumblink onClick={onNavigate}>{linkedEntityMetadataName}</Breadcrumblink> :
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
