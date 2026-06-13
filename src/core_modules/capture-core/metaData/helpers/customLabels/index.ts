export {
    labelKeys,
    getDefaultLabel,
    programLabelFields,
    programStageLabelFields,
    trackedEntityTypeLabelFields,
} from './labels.const';
export type { LabelKey, CustomLabels } from './labels.const';
export { getProgramLabel, getStageLabel, getTrackedEntityTypeLabel } from './getCustomLabel';
export { useProgramLabel, useStageLabel, useTrackedEntityTypeLabel } from './useCustomLabel';
export { applyCustomLabels } from './applyCustomLabels';
