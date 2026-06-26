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
export type CustomLabelScope = 'program' | 'programStage' | 'trackedEntityType';

// Each scope lists only the label keys that its cached object can carry. Tracked entity types
// are kept separate because their singular label is the generic `displayName`, which also exists
// on programs and stages — extracting it for them would leak the object's own name.
const KEYS_BY_SCOPE: Record<CustomLabelScope, ReadonlyArray<CustomLabelKey>> = {
    program: ['enrollment', 'followUp', 'orgUnit', 'attribute', 'programStage', 'event'],
    programStage: ['programStage', 'event'],
    trackedEntityType: ['trackedEntityType'],
};

const fieldsForScope = (scope: CustomLabelScope): Array<string> =>
    Array.from(
        new Set(
            KEYS_BY_SCOPE[scope]
                .flatMap((key) => {
                    const term: CustomLabelField = CUSTOM_LABEL_FIELDS[key];
                    return [term.singular, term.plural];
                })
                .filter((field): field is string => Boolean(field)),
        ),
    );

export const extractCustomLabels = (
    cached: Record<string, any>,
    scope: CustomLabelScope,
): CustomLabels => {
    const labels: CustomLabels = {};
    fieldsForScope(scope).forEach((field) => {
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
