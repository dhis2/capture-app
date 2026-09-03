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
    // Nothing added yet.
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
    const stripped = msgid.replace(/\{\{[^}]*\}\}/g, '');
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

function reportViolations(violations) {
    const relPot = path.relative(process.cwd(), POT);
    console.error('i18n:verify — custom-terminology violations found in en.pot:\n');
    for (const v of violations) {
        console.error(`  ${relPot}:${v.line}`);
        console.error(`    msgid: "${v.msgid}"`);
        for (const h of v.hits) {
            console.error(`      ✗ "${h.word}"  →  use ${h.suggestion}`);
        }
        console.error('');
    }
    console.error(`Total: ${violations.length} msgid(s) with untemplated custom terms.\n`);
    console.error('Fix by wrapping the offending word in a custom-terminology template. Example:');
    console.error("  BEFORE:  i18n.t('Delete event')");
    console.error("  AFTER:   customTerms.i18n.t('Delete {{eventLabel}}', { eventLabel })\n");
    console.error('If a hit is a genuine exception, add the exact msgid to the ALLOWLIST');
    console.error('in scripts/verifyCustomTerminology.mjs.');
}

function main() {
    const msgids = extractMsgids(readFileSync(POT, 'utf8'));
    const violations = msgids
        .filter(({ value }) => !FALLBACKS.has(value) && !ALLOWLIST.has(value))
        .map(({ value, line }) => ({ msgid: value, line, hits: findViolations(value) }))
        .filter(({ hits }) => hits.length > 0);

    if (violations.length === 0) {
        console.log('i18n:verify — no custom-terminology violations in en.pot ✓');
        return;
    }

    reportViolations(violations);
    process.exit(1);
}

main();
