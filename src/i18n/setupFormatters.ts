/**
 * Patches d2-i18n's interpolator for custom terminology.
 *
 *   1. If the template interpolates any variable listed in CUSTOM_TERM_VARS,
 *      HTML escaping is disabled for that call.
 *      All other translations keep default HTML escaping (XSS safety).
 *   2. If a custom-term variable is the leading token in a template, its value
 *      is capitalized (locale-aware).
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

const patchInterpolator = () => {
    const interpolator = (i18n as any).services?.interpolator;
    if (!interpolator) return;

    const original = interpolator.interpolate.bind(interpolator);
    interpolator.interpolate = (template: string, data: Record<string, unknown>, lng: string, opts: any) => {
        const usedVars = [...template.matchAll(/\{\{\s*(\w+)/g)].map(m => m[1]);
        const hasCustomTerm = usedVars.some(name => CUSTOM_TERM_VARS.has(name));
        if (!hasCustomTerm) return original(template, data, lng, opts);

        const leading = /^\{\{\s*(\w+)/.exec(template.trimStart())?.[1];
        const shouldCapitalize = leading && CUSTOM_TERM_VARS.has(leading) && typeof data?.[leading] === 'string';
        const preparedData = shouldCapitalize
            ? { ...data, [leading]: capitalizeFirstLetter(data[leading] as string) }
            : (data ?? {});

        const previousEscapeValue = interpolator.escapeValue;
        interpolator.escapeValue = false;
        try {
            return original(template, preparedData, lng, opts);
        } finally {
            interpolator.escapeValue = previousEscapeValue;
        }
    };
};

patchInterpolator();
