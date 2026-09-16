/*
 * Verifies that i18n/en.pot contains no msgid where custom terminology
 * appears outside a {{...}}-template placeholder.
 *
 * Custom terms (enrollment, event, program stage, note, relationship, attribute,
 * organisation unit, follow-up) needs to be inside {{...}}-template placeholder
 * to be overridden per program at runtime.

 * Runs with `yarn i18n:verify`
 */
/* eslint-disable no-console */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const POT = fileURLToPath(new URL('../i18n/en.pot', import.meta.url));

const CUSTOM_TERMS = [
    { words: ['enrollment', 'enrolment'], suggestion: '{{enrollmentLabel}}' },
    { words: ['enrollments', 'enrolments'], suggestion: '{{enrollmentsLabel}}' },
    { words: ['event'], suggestion: '{{eventLabel}}' },
    { words: ['events'], suggestion: '{{eventsLabel}}' },
    { words: ['program stage'], suggestion: '{{programStageLabel}}' },
    { words: ['program stages'], suggestion: '{{programStagesLabel}}' },
    { words: ['note'], suggestion: '{{noteLabel}}' },
    { words: ['notes'], suggestion: '{{notesLabel}}' },
    { words: ['relationship'], suggestion: '{{relationshipLabel}}' },
    { words: ['relationships'], suggestion: '{{relationshipsLabel}}' },
    { words: ['attribute'], suggestion: '{{attributeLabel}}' },
    { words: ['attributes'], suggestion: '{{attributesLabel}}' },
    { words: ['organisation unit', 'org unit', 'organization unit', 'registering unit'], suggestion: '{{orgUnitLabel}}' },
    { words: ['follow-up', 'followup', 'follow up'], suggestion: '{{followUpLabel}}' },
];

const FALLBACKS = new Set([
    'enrollment', 'enrollments',
    'event', 'events',
    'program stage', 'program stages',
    'note', 'notes',
    'relationship', 'relationships',
    'attribute', 'attributes',
    'organisation unit', 'follow-up',
]);

const ALLOWLIST = new Set([
    // "event program" = DHIS2 programType, not user's event terminology
    'This is not an event program or the metadata is corrupt. See log for details.',
    // "event program" = DHIS2 programType, not user's event terminology
    '{{programName}} is an event program and does not have {{enrollmentsLabel}}.',
    // NoSelectionsInfoBox — only renders when no program is selected, so no program-specific label to use
    'Choose a program and organisation unit to see existing data and create new records.',
    // ProgramList — program picker shows generic label rather than any single program's custom label
    'Some programs are being filtered by the chosen organisation unit',
]);

function extractStrings(potContents) {
    const header = /^(msgid|msgstr(?:\[\d+\])?) "(.*)"$/;
    const continuation = /^"(.*)"$/;

    const entries = [];
    potContents.split('\n').forEach((line, idx) => {
        const h = line.match(header);
        if (h) {
            entries.push({ kind: h[1], value: h[2], line: idx + 1 });
            return;
        }
        const c = line.match(continuation);
        if (c && entries.length) entries[entries.length - 1].value += c[1];
    });

    let currentMsgid = null;
    return entries.flatMap(({ kind, value, line }) => {
        if (kind === 'msgid') currentMsgid = value;
        return value && currentMsgid ? [{ value, line, msgid: currentMsgid, kind }] : [];
    });
}

function findViolations(msgid) {
    const stripped = msgid.replace(/\{\{[^{}]*\}\}/g, '');
    const hits = [];
    for (const { words, suggestion } of CUSTOM_TERMS) {
        for (const word of words) {
            const re = new RegExp(String.raw`\b${word}\b`, 'i');
            if (re.test(stripped)) {
                hits.push({ word, suggestion });
                break;
            }
        }
    }
    return hits;
}

const DIVIDER = '━'.repeat(72);

function reportViolations(violations) {
    const relPot = path.relative(process.cwd(), POT);
    console.error(`\n${DIVIDER}\n`);
    for (const v of violations) {
        console.error(`  ${relPot}:${v.line}`);
        console.error(`    msgid:      "${v.msgid}"`);
        if (v.value !== v.msgid) console.error(`    ${v.kind.padEnd(11)} "${v.value}"`);
        for (const h of v.hits) {
            console.error(`      ✗ "${h.word}"  →  use ${h.suggestion}`);
        }
        console.error('');
    }
    console.error(`\x1b[1;31m${violations.length} custom-terminology violation(s) in en.pot.\x1b[0m\n`);
    console.error('Fix by wrapping the offending word in a custom-terminology template.\n');
    console.error('If a hit is a genuine exception, add the exact msgid to the ALLOWLIST');
    console.error('in scripts/verifyCustomTerminology.mjs.');
    console.error(`\n${DIVIDER}\n`);
}

function main() {
    const strings = extractStrings(readFileSync(POT, 'utf8'));
    const violations = strings
        .filter(({ msgid, value }) => !ALLOWLIST.has(msgid) && !FALLBACKS.has(value))
        .map(({ value, line, msgid, kind }) => ({ msgid, value, line, kind, hits: findViolations(value) }))
        .filter(({ hits }) => hits.length > 0);

    if (violations.length === 0) {
        console.log('i18n:verify — no custom-terminology violations in en.pot');
        return;
    }

    reportViolations(violations);
    process.exit(1);
}

main();
