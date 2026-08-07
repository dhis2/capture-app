import i18n from '@dhis2/d2-i18n';
import { programCollection, trackedEntityTypesCollection } from '../../../metaDataMemoryStores';
import { CUSTOM_LABEL_FIELDS, resolveCustomLabel } from './customLabels';
import type { CustomLabelKey, CustomLabels, CustomLabelField } from './customLabels';

export type TerminologyContext = {
    programId?: string,
    stageId?: string,
    trackedEntityTypeId?: string,
};

type TermEntry = {
    key: CustomLabelKey,
    plural: boolean,
    english: string,
};

// Derive the flat list of match candidates from CUSTOM_LABEL_FIELDS (single source
// of truth). Includes each form's English word plus any aliases (e.g. "stage" for
// programStage.singular). Sorted longest-first so multi-word forms are tried before
// their sub-strings — the combined regex's alternation then respects that order.
const TERM_ENTRIES: ReadonlyArray<TermEntry> = (
    Object.entries(CUSTOM_LABEL_FIELDS) as ReadonlyArray<[CustomLabelKey, CustomLabelField]>
).flatMap(([key, forms]) => {
    const out: TermEntry[] = [];
    const addForm = (form: { english: string, aliases?: ReadonlyArray<string> }, plural: boolean) => {
        out.push({ key, plural, english: form.english });
        (form.aliases ?? []).forEach(alias => out.push({ key, plural, english: alias }));
    };
    if (forms.plural) addForm(forms.plural, true);
    if (forms.singular) addForm(forms.singular, false);
    return out;
}).sort((a, b) => b.english.length - a.english.length);

const escapeRegExp = (input: string): string => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const COMBINED_PATTERN = new RegExp(
    `\\b(${TERM_ENTRIES.map(entry => escapeRegExp(entry.english)).join('|')})\\b`,
    'gi',
);

const findEntry = (match: string): TermEntry | undefined => {
    const lower = match.toLowerCase();
    return TERM_ENTRIES.find(entry => entry.english === lower);
};

const preserveCase = (match: string, replacement: string, locale: string): string => {
    if (match.length > 1 && match === match.toLocaleUpperCase(locale)) {
        return replacement.toLocaleUpperCase(locale);
    }
    if (match[0] === match[0].toLocaleUpperCase(locale)) {
        return replacement.charAt(0).toLocaleUpperCase(locale) + replacement.slice(1);
    }
    return replacement;
};

const getLabelSources = ({
    programId,
    stageId,
    trackedEntityTypeId,
}: TerminologyContext): Array<CustomLabels | undefined> => {
    const program = programId ? programCollection.get(programId) : undefined;
    const stage = program && stageId ? program.getStage(stageId) : undefined;
    const tet = trackedEntityTypeId ? trackedEntityTypesCollection.get(trackedEntityTypeId) : undefined;
    // Precedence: stage overrides program overrides TET.
    return [stage?.customLabels, program?.customLabels, tet?.customLabels];
};

/**
 * Substitute DHIS2 terminology (enrollment, event, note, relationship, ...) in a
 * translated string with per-program custom labels when configured. Case in the
 * source string is preserved on the substituted term. Locale-aware via `i18n.language`.
 *
 * @example
 *   applyCustomTerminology(i18n.t('Write a note about this enrollment'), { programId })
 */
export const applyCustomTerminology = (
    translatedText: string,
    context: TerminologyContext = {},
): string => {
    // Defensive: t() can return non-string values (arrays/objects when
    // returnObjects: true, undefined for missing keys with certain configs).
    // Only strings go through the substitution pipeline; everything else is
    // returned as-is so callers see the original i18next output unchanged.
    if (typeof translatedText !== 'string' || !translatedText) return translatedText;
    const { programId, stageId, trackedEntityTypeId } = context;
    if (!programId && !stageId && !trackedEntityTypeId) return translatedText;

    const sources = getLabelSources(context);
    const locale = i18n.language || 'en';

    return translatedText.replace(COMBINED_PATTERN, (match) => {
        const entry = findEntry(match);
        if (!entry) return match;
        const custom = resolveCustomLabel(sources, entry.key, { plural: entry.plural });
        if (!custom) return match;
        return preserveCase(match, custom, locale);
    });
};
