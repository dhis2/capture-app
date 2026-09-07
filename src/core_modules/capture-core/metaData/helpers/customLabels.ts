import { useSelector } from 'react-redux';
import { programCollection } from '../../metaDataMemoryStores';
import { LABELS, type LabelConfig } from './constants/customLabels.const';

export type CustomLabelKey = keyof typeof LABELS;
export type CustomLabels = Record<string, string>;
export type TermRequest = CustomLabelKey | { key: CustomLabelKey; plural?: boolean };

type LabelSource = Record<string, unknown> | undefined | null;

type ProgramScope = { programId: string | null | undefined; stageId?: string | null };
type OptionalProgramScope = { programId?: string | null; stageId?: string | null };
type ProgramContainer = { program: LabelSource };

const getLabel = (key: CustomLabelKey): LabelConfig => LABELS[key];

const ALL_FIELD_NAMES = Object.values(LABELS as Record<string, LabelConfig>).flatMap(
    ({ apiFieldSingular, apiFieldPlural }) => (apiFieldPlural ? [apiFieldSingular, apiFieldPlural] : [apiFieldSingular]),
);

const resolveDefault = (key: CustomLabelKey, plural: boolean): string => {
    const label = getLabel(key);
    return plural ? label.defaultPlural?.() ?? label.defaultSingular() : label.defaultSingular();
};

const resolveLabel = (
    sources: ReadonlyArray<LabelSource>,
    key: CustomLabelKey,
    plural: boolean,
): string => {
    const { apiFieldSingular, apiFieldPlural } = getLabel(key);
    const target = plural ? apiFieldPlural : apiFieldSingular;
    const found = target
        ? sources
            .map(source => source?.[target])
            .find((value): value is string => typeof value === 'string')
        : undefined;
    return found ?? resolveDefault(key, plural);
};

const resolveFromCollection = (
    programId: string | null | undefined,
    stageId: string | null | undefined,
    key: CustomLabelKey,
    plural: boolean,
): string => {
    const program = programId ? programCollection.get(programId) : undefined;
    const stage = program && stageId ? program.getStage(stageId) : undefined;
    return resolveLabel([stage?.customLabels, program?.customLabels], key, plural);
};

const buildLabels = (
    requests: ReadonlyArray<TermRequest>,
    resolve: (key: CustomLabelKey, plural: boolean) => string,
): CustomLabels => {
    const entries = requests.map((req) => {
        const isString = typeof req === 'string';
        const key = isString ? req : req.key;
        const plural = !isString && (req.plural ?? false);
        const outputKey = plural ? `${key}sLabel` : `${key}Label`;
        return [outputKey, resolve(key, plural)];
    });
    return Object.fromEntries(entries);
};

/** Use in metadata-load code (factories) to pluck label fields from a raw API object. */
export const extractCustomLabels = (cached: Record<string, unknown>): CustomLabels =>
    Object.fromEntries(
        ALL_FIELD_NAMES.flatMap((field) => {
            const value = cached[field];
            return typeof value === 'string' ? [[field, value]] : [];
        }),
    );

/** Use outside React (selectors, thunks); reads from `programCollection`. */
export const getTermLabel = (
    requests: ReadonlyArray<TermRequest>,
    { programId, stageId }: ProgramScope,
): CustomLabels =>
    buildLabels(requests, (key, plural) => resolveFromCollection(programId, stageId, key, plural));

/** Use in self-contained widgets that already own the program object (no Redux dep). */
export const getTermLabelFromProgram = (
    requests: ReadonlyArray<TermRequest>,
    { program }: ProgramContainer,
): CustomLabels =>
    buildLabels(requests, (key, plural) => resolveLabel([program], key, plural));

/** Use inside React components; `programId` falls back to `currentSelections.programId`. */
export const useTermLabel = (
    requests: ReadonlyArray<TermRequest>,
    { programId, stageId }: OptionalProgramScope = {},
): CustomLabels => {
    const activeProgramId = useSelector(({ currentSelections }: any) =>
        programId ?? currentSelections.programId);
    return buildLabels(requests, (key, plural) =>
        resolveFromCollection(activeProgramId, stageId, key, plural));
};
