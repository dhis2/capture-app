import { useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiMetadataQuery, ReactQueryAppNamespace } from '../../../utils/reactQueryHelpers';

// Structure of the `workingLists` key in the `capture` DataStore namespace.
// Kept in sync with the reader in
// components/Pages/MainPage/.../EventWorkingListsInit/InitOnline/useMainViewConfig.ts
export type FilterMode = 'RELATIVE' | 'BUFFER';

type OccurredAt = {
    type: 'RELATIVE',
    period?: string,
    startBuffer?: number,
    endBuffer?: number,
    lockedInAllViews?: boolean,
};

export type WorkingListsValue = {
    version?: number,
    global?: {
        event?: {
            mainView?: {
                occurredAt?: OccurredAt,
            },
        },
    },
};

export type WorkingListsForm = {
    enabled: boolean,
    mode: FilterMode,
    period: string,
    startBuffer: string,
    endBuffer: string,
    locked: boolean,
};

const RELATIVE_PERIODS = new Set([
    'TODAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_YEAR', 'LAST_WEEK', 'LAST_MONTH', 'LAST_3_MONTHS',
]);

export const DEFAULT_FORM: WorkingListsForm = {
    enabled: false,
    mode: 'RELATIVE',
    period: 'THIS_MONTH',
    startBuffer: '-30',
    endBuffer: '0',
    locked: false,
};

const toNumber = (value: string): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

// DataStore value -> editable form. Falls back to defaults for anything missing/unsupported.
export const valueToForm = (value: WorkingListsValue | undefined | null): WorkingListsForm => {
    const occurredAt = value?.global?.event?.mainView?.occurredAt;
    if (!occurredAt || occurredAt.type !== 'RELATIVE') {
        return DEFAULT_FORM;
    }

    const locked = Boolean(occurredAt.lockedInAllViews);

    if (occurredAt.period && RELATIVE_PERIODS.has(occurredAt.period)) {
        return { ...DEFAULT_FORM, enabled: true, mode: 'RELATIVE', period: occurredAt.period, locked };
    }

    if (occurredAt.startBuffer !== undefined || occurredAt.endBuffer !== undefined) {
        return {
            ...DEFAULT_FORM,
            enabled: true,
            mode: 'BUFFER',
            startBuffer: String(occurredAt.startBuffer ?? 0),
            endBuffer: String(occurredAt.endBuffer ?? 0),
            locked,
        };
    }

    return { ...DEFAULT_FORM, enabled: true, locked };
};

// Editable form -> DataStore value. Spreads the existing value so sibling keys
// (other features, future fields) survive the whole-object replace.
export const formToValue = (
    existing: WorkingListsValue | undefined | null,
    form: WorkingListsForm,
): WorkingListsValue => {
    const occurredAt: OccurredAt = form.mode === 'RELATIVE'
        ? { type: 'RELATIVE', period: form.period, lockedInAllViews: form.locked }
        : {
            type: 'RELATIVE',
            startBuffer: toNumber(form.startBuffer),
            endBuffer: toNumber(form.endBuffer),
            lockedInAllViews: form.locked,
        };

    const mainView = {
        ...existing?.global?.event?.mainView,
    };
    if (form.enabled) {
        mainView.occurredAt = occurredAt;
    } else {
        delete mainView.occurredAt;
    }

    return {
        ...existing,
        version: 1,
        global: {
            ...existing?.global,
            event: {
                ...existing?.global?.event,
                mainView,
            },
        },
    };
};

export const useWorkingListsConfig = () => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();
    const { show: showSuccess } = useAlert(({ message }) => message, { success: true });
    const { show: showError } = useAlert(({ message }) => message, { critical: true });

    // The capture namespace / workingLists key may not exist yet — that decides create vs replace.
    const {
        data: keyExists,
        isLoading: namespaceLoading,
        isError: namespaceError,
    } = useApiMetadataQuery<Array<string>, boolean>(
        ['dataStore', 'capture'],
        { resource: 'dataStore/capture' },
        { select: (keys: Array<string> | undefined) => Boolean(keys?.includes('workingLists')) },
    );

    const {
        data: value,
        isInitialLoading: valueLoading,
        isError: valueError,
    } = useApiMetadataQuery<WorkingListsValue>(
        ['dataStore', 'workingListsEvents'],
        { resource: 'dataStore/capture/workingLists' },
        { enabled: Boolean(keyExists) },
    );

    const { mutateAsync, isLoading: isSaving } = useMutation(
        (nextValue: WorkingListsValue) =>
            dataEngine.mutate({
                resource: 'dataStore/capture/workingLists',
                // DataStore has no field-level write: POST creates the key the first
                // time, PUT (replace) overwrites the whole value afterwards.
                type: keyExists ? 'replace' : 'create',
                data: nextValue,
            } as any),
        {
            onSuccess: () => {
                // Refresh the namespace + key reads so the main working list picks up the change.
                queryClient.invalidateQueries([ReactQueryAppNamespace, 'dataStore']);
                showSuccess({ message: i18n.t('Working list settings saved') });
            },
            onError: () => {
                showError({ message: i18n.t('Could not save working list settings') });
            },
        },
    );

    const save = useCallback(
        (form: WorkingListsForm) => mutateAsync(formToValue(value, form)),
        [mutateAsync, value],
    );

    return {
        initialForm: valueToForm(value),
        isLoading: namespaceLoading || valueLoading,
        isError: namespaceError || valueError,
        isSaving,
        save,
    };
};
