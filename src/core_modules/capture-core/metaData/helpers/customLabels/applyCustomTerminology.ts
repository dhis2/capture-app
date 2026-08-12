import i18n from '@dhis2/d2-i18n';
import { programCollection } from '../../../metaDataMemoryStores';
import { CUSTOM_LABEL_FIELDS, resolveCustomLabel } from './customLabels';
import type { CustomLabelKey, CustomLabels, CustomLabelField } from './customLabels';

export type TerminologyContext = {
    programId?: string,
    stageId?: string,
};

// Unicode "non-characters" (U+FDD0 / U+FDD1) — the Unicode standard reserves
// these to never be used for text, so they never collide with real content.
// The bootstrap wrapper brackets every interpolated value with these markers
// so we can skip them here and avoid rewriting server-supplied names that
// happen to contain a token word (e.g. a stage named "Birth event").
export const INTERPOLATION_OPEN = '﷐';
export const INTERPOLATION_CLOSE = '﷑';
const INTERPOLATION_PATTERN = new RegExp(`${INTERPOLATION_OPEN}(.*?)${INTERPOLATION_CLOSE}`, 'g');

type TermEntry = {
    key: CustomLabelKey,
    plural: boolean,
    english: string,
};

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

const escapeRegExp = (input: string): string => input.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

const COMBINED_PATTERN_SOURCE = String.raw`\b(${TERM_ENTRIES.map(entry => escapeRegExp(entry.english)).join('|')})\b`;
const COMBINED_PATTERN = new RegExp(COMBINED_PATTERN_SOURCE, 'gi');
// Non-global variant used only for the wrapper fast-path — `.test` on a
// global regex is stateful (advances lastIndex), which we want to avoid.
const HAS_ANY_TOKEN_PATTERN = new RegExp(COMBINED_PATTERN_SOURCE, 'i');

export const hasCustomTerminologyTokens = (text: string): boolean =>
    typeof text === 'string' && HAS_ANY_TOKEN_PATTERN.test(text);

const findEntry = (match: string): TermEntry | undefined => {
    const lower = match.toLowerCase();
    return TERM_ENTRIES.find(entry => entry.english === lower);
};

const preserveCase = (match: string, replacement: string, locale: string): string => {
    if (match.length > 1 && match === match.toLocaleUpperCase(locale)) {
        return replacement.toLocaleUpperCase(locale);
    }
    const firstUpper = match.charAt(0).toLocaleUpperCase(locale);
    if (match.startsWith(firstUpper)) {
        return replacement.charAt(0).toLocaleUpperCase(locale) + replacement.slice(1);
    }
    return replacement;
};

const getLabelSources = ({
    programId,
    stageId,
}: TerminologyContext): Array<CustomLabels | undefined> => {
    const program = programId ? programCollection.get(programId) : undefined;
    const stage = program && stageId ? program.getStage(stageId) : undefined;
    return [stage?.customLabels, program?.customLabels];
};

export const applyCustomTerminology = (
    translatedText: string,
    context: TerminologyContext = {},
): string => {
    if (typeof translatedText !== 'string' || !translatedText) return translatedText;
    const { programId, stageId } = context;
    if (!programId && !stageId) return translatedText;

    const sources = getLabelSources(context);
    const locale = i18n.language || 'en';

    const substitute = (text: string): string => text.replace(COMBINED_PATTERN, (match) => {
        const entry = findEntry(match);
        if (!entry) return match;
        const custom = resolveCustomLabel(sources, entry.key, { plural: entry.plural });
        if (!custom) return match;
        return preserveCase(match, custom, locale);
    });

    // Split on sentinel-wrapped interpolation regions. String.split with a
    // capturing group returns [outside, inside, outside, ...] — substitute
    // only in the outside parts so server-supplied values pass through
    // unchanged. If no sentinels are present, we get [translatedText] and
    // just substitute the whole thing.
    const parts = translatedText.split(INTERPOLATION_PATTERN);
    return parts.map((part, i) => (i % 2 === 0 ? substitute(part) : part)).join('');
};
