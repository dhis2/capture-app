import { NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS } from '../wizardSteps.const';

export type PlainProps = {
    readonly currentStep: typeof NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS[keyof typeof NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS];
    readonly onNavigate: (
        step: typeof NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS[keyof typeof NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS]
    ) => void;
    readonly trackedEntityTypeName?: string;
    readonly linkedEntityMetadataName?: string;
};
