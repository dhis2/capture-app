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
    { words: ['enrollment'], suggestion: '{{enrollmentLabel}}' },
    { words: ['enrollments'], suggestion: '{{enrollmentsLabel}}' },
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
    { words: ['tracked entity attribute', 'tracked entity attributes'], suggestion: '{{attributeLabel}}' },
    { words: ['org unit'], suggestion: '{{orgUnitLabel}}' },
    { words: ['organisation unit'], suggestion: '{{orgUnitLabel}}' },
    { words: ['registering unit'], suggestion: '{{orgUnitLabel}}' },
    { words: ['follow-up', 'followup'], suggestion: '{{followUpLabel}}' },
].sort((a, b) => Math.max(...b.words.map(w => w.length)) - Math.max(...a.words.map(w => w.length)));

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
]);

// POT may split long msgids across multiple lines; concatenate them.
function extractMsgids(potContents) {
    const lines = potContents.split('\n');
    const msgids = [];
    let i = 0;
    while (i < lines.length) {
        const match = lines[i].match(/^msgid "(.*)"$/);
        if (match) {
            let value = match[1];
            let j = i + 1;
            while (j < lines.length && /^"(.*)"$/.test(lines[j])) {
                value += lines[j].match(/^"(.*)"$/)[1];
                j += 1;
            }
            if (value !== '') msgids.push({ value, line: i + 1 });
            i = j;
        } else {
            i += 1;
        }
    }
    return msgids;
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
        console.error(`    msgid: "${v.msgid}"`);
        for (const h of v.hits) {
            console.error(`      ✗ "${h.word}"  →  use ${h.suggestion}`);
        }
        console.error('');
    }
    console.error(`\x1b[1;31m${violations.length} custom-terminology violation(s) in en.pot.\x1b[0m\n`);
    console.error('Fix by wrapping the offending word in a custom-terminology template. Example:');
    console.error("  BEFORE:  i18n.t('Delete event')");
    console.error("  AFTER:   i18n.t('Delete {{eventLabel}}', { eventLabel })");
    console.error("  Where `eventLabel = useTermLabel('event', { programId })`");
    console.error('  (or getTermLabel outside React).\n');
    console.error('If a hit is a genuine exception, add the exact msgid to the ALLOWLIST');
    console.error('in scripts/verifyCustomTerminology.mjs.');
    console.error(`\n${DIVIDER}\n`);
}

function main() {
    const msgids = extractMsgids(readFileSync(POT, 'utf8'));
    const violations = msgids
        .filter(({ value }) => !FALLBACKS.has(value) && !ALLOWLIST.has(value))
        .map(({ value, line }) => ({ msgid: value, line, hits: findViolations(value) }))
        .filter(({ hits }) => hits.length > 0);

    if (violations.length === 0) {
        console.log(`\n${DIVIDER}`);
        console.log(' i18n:verify — no custom-terminology violations in en.pot ✓');
        console.log(`${DIVIDER}\n`);
        return;
    }

    reportViolations(violations);
    process.exit(1);
}

main();
