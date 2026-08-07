import i18n from '@dhis2/d2-i18n';
import { programCollection } from '../../../metaDataMemoryStores';
import { CUSTOM_LABEL_FIELDS, resolveCustomLabel } from './customLabels';
import type { CustomLabelKey, CustomLabels, CustomLabelField } from './customLabels';

export type TerminologyContext = {
    programId?: string,
    stageId?: string,
};

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

const COMBINED_PATTERN = new RegExp(
    String.raw`\b(${TERM_ENTRIES.map(entry => escapeRegExp(entry.english)).join('|')})\b`,
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

    return translatedText.replace(COMBINED_PATTERN, (match) => {
        const entry = findEntry(match);
        if (!entry) return match;
        const custom = resolveCustomLabel(sources, entry.key, { plural: entry.plural });
        if (!custom) return match;
        return preserveCase(match, custom, locale);
    });
};
