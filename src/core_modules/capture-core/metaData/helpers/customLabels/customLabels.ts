import { capitalizeFirstLetter } from 'capture-core-utils/string';

type CustomLabelField = {
    singular?: string,
    plural?: string,
};

export const CUSTOM_LABEL_FIELDS = {
    enrollment: { singular: 'displayEnrollmentLabel', plural: 'displayEnrollmentsLabel' },
    followUp: { singular: 'displayFollowUpLabel' },
    orgUnit: { singular: 'displayOrgUnitLabel' },
    attribute: { plural: 'displayTrackedEntityAttributeLabel' },
    programStage: { singular: 'displayProgramStageLabel', plural: 'displayProgramStagesLabel' },
    event: { singular: 'displayEventLabel', plural: 'displayEventsLabel' },
    trackedEntityType: { singular: 'displayName', plural: 'displayTrackedEntityTypesLabel' },
} as const satisfies { [key: string]: CustomLabelField };

export type CustomLabelKey = keyof typeof CUSTOM_LABEL_FIELDS;
export type CustomLabels = Record<string, string>;
export type LabelOptions = { plural?: boolean };

const allFields: Array<string> = Array.from(
    new Set(
        Object.values(CUSTOM_LABEL_FIELDS)
            .flatMap((term: CustomLabelField) => [term.singular, term.plural])
            .filter((field): field is string => Boolean(field)),
    ),
);

export const extractCustomLabels = (cached: Record<string, any>): CustomLabels => {
    const labels: CustomLabels = {};
    allFields.forEach((field) => {
        if (cached[field]) {
            labels[field] = cached[field];
        }
    });
    return labels;
};

type LabelSource = CustomLabels | undefined | null;

export const resolveLabel = (
    sources: LabelSource | Array<LabelSource>,
    key: CustomLabelKey,
    { plural = false }: LabelOptions = {},
): string | undefined => {
    const term: CustomLabelField = CUSTOM_LABEL_FIELDS[key];
    const list = Array.isArray(sources) ? sources : [sources];
    const pick = (field?: string) => (field ? list.find(source => source?.[field])?.[field] : undefined);

    const field = plural && term.plural ? term.plural : term.singular;
    const value = pick(field);
    return value ? capitalizeFirstLetter(value) : value;
};

type WithLabels = { customLabels?: CustomLabels } | undefined | null;

export const getProgramLabel = (program: WithLabels, key: CustomLabelKey, options?: LabelOptions): string | undefined =>
    resolveLabel(program?.customLabels, key, options);

export const getStageLabel = (
    stage: WithLabels,
    program: WithLabels,
    key: CustomLabelKey,
    options?: LabelOptions,
): string | undefined => resolveLabel([stage?.customLabels, program?.customLabels], key, options);

export const getTrackedEntityTypeLabel = (
    trackedEntityType: WithLabels,
    key: CustomLabelKey,
    options?: LabelOptions,
): string | undefined => resolveLabel(trackedEntityType?.customLabels, key, options);
