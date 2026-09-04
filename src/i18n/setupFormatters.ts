/**
 * Startup patch to d2-i18n's interpolator for configured custom terms:
 *   - skips HTML escaping so labels render as-is
 *   - locale-aware capitalizes the first letter of a custom-term variable
 *     when it is the leading token in a template
 */

import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';

const CUSTOM_TERM_VARS = new Set([
    'enrollmentLabel', 'enrollmentsLabel',
    'eventLabel', 'eventsLabel',
    'programStageLabel', 'programStagesLabel',
    'linkableStageLabel',
    'followUpLabel', 'orgUnitLabel',
    'relationshipLabel', 'relationshipsLabel',
    'noteLabel', 'notesLabel',
    'attributeLabel', 'attributesLabel',
    'trackedEntityLabel', 'trackedEntityTypesLabel',
]);

const LEADING_VAR_REGEX = /^\{\{(\w+)/;

const capFirstCustomTerm = (template: string, data: Record<string, unknown>) => {
    const name = LEADING_VAR_REGEX.exec(template.trimStart())?.[1];
    if (!name || !CUSTOM_TERM_VARS.has(name) || typeof data[name] !== 'string') return data;
    return { ...data, [name]: capitalizeFirstLetter(data[name] as string) };
};

type Interpolator = {
    interpolate: (str: string, data: Record<string, unknown>, lng: string, opts: unknown) => string;
    escapeValue: boolean;
    options: { interpolation: { escapeValue: boolean } };
};
const interpolator = (i18n as unknown as { services?: { interpolator?: Interpolator } }).services?.interpolator;
if (interpolator) {
    interpolator.options.interpolation.escapeValue = false;
    interpolator.escapeValue = false;
    const original = interpolator.interpolate.bind(interpolator);
    interpolator.interpolate = (str, data, lng, opts) =>
        original(str, capFirstCustomTerm(str, data ?? {}), lng, opts);
}
