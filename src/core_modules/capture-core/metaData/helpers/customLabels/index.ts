export {
    CUSTOM_LABEL_FIELDS,
    resolveLabel,
    extractCustomLabels,
    getProgramLabel,
    getStageLabel,
    getTrackedEntityTypeLabel,
} from './customLabels';
export type { TermKey, CustomLabels, LabelOptions } from './customLabels';
export { useProgramLabel, useStageLabel, useTrackedEntityTypeLabel } from './useLabel';
