import { createSelector } from 'reselect';
import { effectActions } from '@dhis2/rules-engine-javascript';

type HiddenFieldMeta = { content?: string; name?: string; hadValue?: boolean };

const getRuleEffects = (state: any) => state.enrollmentDomain?.ruleEffects;

export const selectEnrollmentHiddenAttributeIds = createSelector(
    getRuleEffects,
    (effects) => {
        const hide = effects?.[effectActions.HIDE_FIELD];
        if (!hide) return undefined;
        return Object.keys(hide).reduce((acc: Record<string, HiddenFieldMeta>, key) => {
            const [value] = hide[key];
            acc[key] = { content: value.content, name: value.name, hadValue: value.hadValue };
            return acc;
        }, {});
    },
);

export const selectEnrollmentHiddenProgramStageIds = createSelector(
    getRuleEffects,
    (effects) => {
        const hide = effects?.[effectActions.HIDE_PROGRAM_STAGE];
        if (!hide) return undefined;
        return Object.keys(hide).reduce((acc: Record<string, true>, key) => {
            acc[key] = true;
            return acc;
        }, {});
    },
);

const mapGeneralMessages = (byId: any, pick: (effect: any) => string) =>
    (byId?.general ? byId.general.map(pick) : []);

export const selectEnrollmentWidgetEffects = createSelector(
    getRuleEffects,
    effects => ({
        errors: mapGeneralMessages(effects?.[effectActions.SHOW_ERROR], (e: any) => e.error),
        warnings: mapGeneralMessages(effects?.[effectActions.SHOW_WARNING], (w: any) => w.warning),
        feedbacks: [
            ...(effects?.[effectActions.DISPLAY_TEXT]?.feedback?.map((e: any) => e.displayText) ?? []),
            ...(effects?.[effectActions.DISPLAY_KEY_VALUE_PAIR]?.feedback?.map((e: any) => e.displayKeyValuePair) ?? []),
        ],
        indicators: [
            ...(effects?.[effectActions.DISPLAY_TEXT]?.indicators?.map((e: any) => e.displayText) ?? []),
            ...(effects?.[effectActions.DISPLAY_KEY_VALUE_PAIR]?.indicators?.map((e: any) => e.displayKeyValuePair) ?? []),
        ],
    }),
);
