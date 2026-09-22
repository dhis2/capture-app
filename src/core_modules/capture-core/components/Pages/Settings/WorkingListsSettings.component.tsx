import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    Checkbox,
    Radio,
    SingleSelect,
    SingleSelectOption,
    InputField,
    Button,
    NoticeBox,
    CircularLoader,
} from '@dhis2/ui';
import { useWorkingListsConfig, DEFAULT_FORM, type WorkingListsForm } from './useWorkingListsConfig';
import pageStyles from './SettingsPage.module.css';
import styles from './WorkingListsSettings.module.css';

export type SaveControls = {
    isDirty: boolean,
    isSaving: boolean,
    onSave: () => Promise<void>,
    onDiscard: () => void,
};

type OwnProps = {
    showPlaceholders?: boolean,
    onSaveControlsChange?: (controls: SaveControls) => void,
};

// Mirrors the `occurredAt` period presets supported by the `workingLists` DataStore key.
const PERIOD_OPTIONS = [
    { value: 'TODAY', label: i18n.t('Today') },
    { value: 'THIS_WEEK', label: i18n.t('This week') },
    { value: 'THIS_MONTH', label: i18n.t('This month') },
    { value: 'THIS_YEAR', label: i18n.t('This year') },
    { value: 'LAST_WEEK', label: i18n.t('Last week') },
    { value: 'LAST_MONTH', label: i18n.t('Last month') },
    { value: 'LAST_3_MONTHS', label: i18n.t('Last 3 months') },
];

// The DataStore stores signed day offsets from today (negative = past, positive = future).
// The UI hides the signs behind a magnitude + a "days ago / days ahead" direction.
const toNum = (value: string): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};
const magnitudeOf = (buffer: string): string => String(Math.abs(toNum(buffer)));
const directionOf = (buffer: string): 'AGO' | 'FROM_NOW' => (toNum(buffer) < 0 ? 'AGO' : 'FROM_NOW');
const toBuffer = (magnitude: string, direction: 'AGO' | 'FROM_NOW'): string =>
    String((direction === 'AGO' ? -1 : 1) * Math.abs(toNum(magnitude)));

const DUMMY_FILTERS = [
    i18n.t('Event programs: Status'),
    i18n.t('Tracker programs: Registered date'),
    i18n.t('Tracker programs: Status'),
];

export const WorkingListsSettings = ({
    showPlaceholders = false,
    onSaveControlsChange,
}: OwnProps) => {
    const { initialForm, isLoading, isError, isSaving, save } = useWorkingListsConfig();

    // `saved` is the baseline persisted in the DataStore key; `form` is the working copy.
    const [saved, setSaved] = useState<WorkingListsForm>(DEFAULT_FORM);
    const [form, setForm] = useState<WorkingListsForm>(DEFAULT_FORM);
    const [ready, setReady] = useState(false);

    // Seed both baseline and working copy once the DataStore read has resolved.
    const seeded = useRef(false);
    useEffect(() => {
        if (!isLoading && !seeded.current) {
            seeded.current = true;
            setSaved(initialForm);
            setForm(initialForm);
            setReady(true);
        }
    }, [isLoading, initialForm]);

    const isDirty = useMemo(
        () => JSON.stringify(form) !== JSON.stringify(saved),
        [form, saved],
    );

    const update = (patch: Partial<WorkingListsForm>) => setForm(prev => ({ ...prev, ...patch }));

    const onSave = useCallback(async () => {
        await save(form);
        setSaved(form);
    }, [save, form]);
    const onDiscard = useCallback(() => setForm(saved), [saved]);

    useEffect(() => {
        onSaveControlsChange?.({ isDirty, isSaving, onSave, onDiscard });
    }, [isDirty, isSaving, onSave, onDiscard, onSaveControlsChange]);

    useEffect(() => () => {
        onSaveControlsChange?.({
            isDirty: false,
            isSaving: false,
            onSave: async () => undefined,
            onDiscard: () => undefined,
        });
    }, [onSaveControlsChange]);

    const [dummyChecked, setDummyChecked] = useState<Record<string, boolean>>({});

    if (isError) {
        return (
            <NoticeBox error title={i18n.t('Could not load settings')}>
                {i18n.t('The working list configuration could not be read from the DataStore.')}
            </NoticeBox>
        );
    }

    if (!ready) {
        return (
            <div className={styles.loading}>
                <CircularLoader small />
            </div>
        );
    }

    return (
        <div>
            <div className={styles.header}>
                <h3 className={pageStyles.contentHeading}>
                    {i18n.t('Global filters')}
                </h3>
                <p className={pageStyles.contentSubheading}>
                    {i18n.t('Set the default filters that apply to working lists for all users and programs')}
                </p>
            </div>

            <div className={styles.checkboxList}>
                <div>
                    <Checkbox
                        dense
                        label={i18n.t('Event programs: Event date')}
                        checked={form.enabled}
                        onChange={({ checked }: { checked: boolean }) => update({ enabled: checked })}
                    />
                    {form.enabled && (
                        <div className={styles.gated}>
                            <div className={styles.field}>
                                <span className={styles.label}>{i18n.t('Filter by')}</span>
                                <div className={styles.radioRow}>
                                    <Radio
                                        dense
                                        label={i18n.t('Preset period')}
                                        checked={form.mode === 'RELATIVE'}
                                        onChange={() => update({ mode: 'RELATIVE' })}
                                    />
                                    <Radio
                                        dense
                                        label={i18n.t('Relative date range')}
                                        checked={form.mode === 'BUFFER'}
                                        onChange={() => update({ mode: 'BUFFER' })}
                                    />
                                </div>

                                {form.mode === 'RELATIVE' ? (
                                    <SingleSelect
                                        dense
                                        selected={form.period}
                                        onChange={({ selected }: { selected: string }) => update({ period: selected })}
                                    >
                                        {PERIOD_OPTIONS.map(opt => (
                                            <SingleSelectOption key={opt.value} value={opt.value} label={opt.label} />
                                        ))}
                                    </SingleSelect>
                                ) : (
                                    <div>
                                        <div className={styles.rangeRow}>
                                            <span className={styles.rangeLead}>{i18n.t('From')}</span>
                                            <div className={styles.rangeNumber}>
                                                <InputField
                                                    dense
                                                    type="number"
                                                    min="0"
                                                    value={magnitudeOf(form.startBuffer)}
                                                    onChange={({ value }) => {
                                                        const direction = directionOf(form.startBuffer);
                                                        update({
                                                            startBuffer: toBuffer(value ?? '', direction),
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className={styles.rangeDirection}>
                                                <SingleSelect
                                                    dense
                                                    selected={directionOf(form.startBuffer)}
                                                    onChange={({ selected }) => {
                                                        const direction = selected === 'FROM_NOW' ? 'FROM_NOW' : 'AGO';
                                                        update({
                                                            startBuffer: toBuffer(magnitudeOf(form.startBuffer), direction),
                                                        });
                                                    }}
                                                >
                                                    <SingleSelectOption value="AGO" label={i18n.t('days ago')} />
                                                    <SingleSelectOption value="FROM_NOW" label={i18n.t('days ahead')} />
                                                </SingleSelect>
                                            </div>
                                        </div>
                                        <div className={styles.rangeRow}>
                                            <span className={styles.rangeLead}>{i18n.t('To')}</span>
                                            <div className={styles.rangeNumber}>
                                                <InputField
                                                    dense
                                                    type="number"
                                                    min="0"
                                                    value={magnitudeOf(form.endBuffer)}
                                                    onChange={({ value }) => {
                                                        update({
                                                            endBuffer: toBuffer(value ?? '', directionOf(form.endBuffer)),
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className={styles.rangeDirection}>
                                                <SingleSelect
                                                    dense
                                                    selected={directionOf(form.endBuffer)}
                                                    onChange={({ selected }) => {
                                                        const direction = selected === 'FROM_NOW' ? 'FROM_NOW' : 'AGO';
                                                        update({
                                                            endBuffer: toBuffer(magnitudeOf(form.endBuffer), direction),
                                                        });
                                                    }}
                                                >
                                                    <SingleSelectOption value="AGO" label={i18n.t('days ago')} />
                                                    <SingleSelectOption value="FROM_NOW" label={i18n.t('days ahead')} />
                                                </SingleSelect>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.field}>
                                <Checkbox
                                    dense
                                    label={i18n.t('Always apply this filter')}
                                    checked={form.locked}
                                    onChange={({ checked }: { checked: boolean }) => update({ locked: checked })}
                                />
                                <p className={styles.hint}>
                                    {i18n.t('Users cannot remove this filter from the working list view')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {showPlaceholders && DUMMY_FILTERS.map(label => (
                    <Checkbox
                        key={label}
                        dense
                        label={label}
                        checked={Boolean(dummyChecked[label])}
                        onChange={({ checked }: { checked: boolean }) =>
                            setDummyChecked(prev => ({ ...prev, [label]: checked }))}
                    />
                ))}
            </div>

            {showPlaceholders && (
                <div className={styles.section}>
                    <div className={styles.header}>
                        <h3 className={pageStyles.contentHeading}>
                            {i18n.t('Per-program filters')}
                        </h3>
                        <p className={pageStyles.contentSubheading}>
                            {i18n.t('Set the default filters that apply to a specific program. ' +
                                'Will override any global default filters')}
                        </p>
                    </div>
                    <Button small secondary>
                        {i18n.t('Add program')}
                    </Button>
                </div>
            )}
        </div>
    );
};
