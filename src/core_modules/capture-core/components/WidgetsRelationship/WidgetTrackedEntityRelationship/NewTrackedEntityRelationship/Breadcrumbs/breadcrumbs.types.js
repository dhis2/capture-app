// @flow
import { NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS } from '../wizardSteps.const';

export type Props = {|
    currentStep: $Values<typeof NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS>,
    onNavigate: ($Values<typeof NEW_TRACKED_ENTITY_RELATIONSHIP_WIZARD_STEPS>) => void,
    linkedEntityMetadataName?: string,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
