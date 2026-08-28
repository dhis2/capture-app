import i18n from '@dhis2/d2-i18n';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { programCollection } from '../../metaDataMemoryStores';

type CustomLabelField = {
    field?: string,
    pluralField?: string,
};

export const CUSTOM_LABEL_FIELDS = {
    enrollment: { field: 'displayEnrollmentLabel', pluralField: 'displayEnrollmentsLabel' },
    event: { field: 'displayEventLabel', pluralField: 'displayEventsLabel' },
    programStage: { field: 'displayProgramStageLabel', pluralField: 'displayProgramStagesLabel' },
    note: { field: 'displayNoteLabel' },
    relationship: { field: 'displayRelationshipLabel' },
    attribute: { field: 'displayTrackedEntityAttributeLabel' },
    orgUnit: { field: 'displayOrgUnitLabel' },
    followUp: { field: 'displayFollowUpLabel' },
} as const satisfies { [key: string]: CustomLabelField };

export type CustomLabelKey = keyof typeof CUSTOM_LABEL_FIELDS;
export type CustomLabels = Record<string, string>;
export type LabelOptions = { plural?: boolean };

const allFields: Array<string> = Array.from(
    new Set(
        Object.values(CUSTOM_LABEL_FIELDS)
            .flatMap((term: CustomLabelField) => [term.field, term.pluralField])
            .filter((field): field is string => Boolean(field)),
    ),
);

export const extractCustomLabels = (cached: Record<string, any>): CustomLabels => {
    const labels: CustomLabels = {};
    allFields.forEach((field) => {
        if (cached[field]) labels[field] = cached[field];
    });
    return labels;
};

type LabelSource = CustomLabels | undefined | null;

export const resolveLabel = (
    sources: LabelSource | Array<LabelSource>,
    key: CustomLabelKey,
    { plural = false }: LabelOptions = {},
): string | undefined => {
    const term = CUSTOM_LABEL_FIELDS[key] as CustomLabelField;
    const list = Array.isArray(sources) ? sources : [sources];
    const pick = (field?: string) => (field ? list.find(s => s?.[field])?.[field] : undefined);
    return pick(plural ? term.pluralField : term.field);
};

const defaults: Record<CustomLabelKey, { singular: () => string; plural: () => string }> = {
    enrollment: { singular: () => i18n.t('enrollment'), plural: () => i18n.t('enrollments') },
    event: { singular: () => i18n.t('event'), plural: () => i18n.t('events') },
    programStage: { singular: () => i18n.t('program stage'), plural: () => i18n.t('program stages') },
    note: { singular: () => i18n.t('note'), plural: () => i18n.t('notes') },
    relationship: { singular: () => i18n.t('relationship'), plural: () => i18n.t('relationships') },
    attribute: { singular: () => i18n.t('attribute'), plural: () => i18n.t('attributes') },
    orgUnit: { singular: () => i18n.t('organisation unit'), plural: () => i18n.t('organisation units') },
    followUp: { singular: () => i18n.t('follow-up'), plural: () => i18n.t('follow-ups') },
};

type TermLabelOptions = LabelOptions & { stageId?: string; programId?: string };

const resolveTerm = (
    programId: string | undefined,
    key: CustomLabelKey,
    { stageId, plural = false }: TermLabelOptions,
): string => {
    const program = programId ? programCollection.get(programId) : undefined;
    const stage = program && stageId ? program.getStage(stageId) : undefined;
    const customLabel = resolveLabel([stage?.customLabels, program?.customLabels], key, { plural });
    if (customLabel) return customLabel;
    return plural ? defaults[key].plural() : defaults[key].singular();
};

export const getTermLabel = (
    programId: string | undefined,
    key: CustomLabelKey,
    options: TermLabelOptions = {},
): string => resolveTerm(programId, key, options);

export const useTermLabel = (
    key: CustomLabelKey,
    options: TermLabelOptions = {},
): string => {
    const { programId, stageId, plural } = options;
    const currentProgramId = useSelector(({ currentSelections }: any) => currentSelections.programId);
    const id = programId ?? currentProgramId;
    return useMemo(
        () => resolveTerm(id, key, { stageId, plural }),
        [id, key, stageId, plural],
    );
};
