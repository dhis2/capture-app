// @flow
import React, { type ComponentType, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, colors, Radio, spacers, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { actions as RelatedStagesActionTypes, mainOptionTranslatedTexts, relatedStageStatus } from '../constants';
import { useCanAddNewEventToStage } from '../hooks/useCanAddNewEventToStage';
import { DataSection } from '../../DataSection';
import { ScheduleInOrgUnit } from '../ScheduleInOrgUnit';
import { useProgramStageInfo } from '../../../metaDataMemoryStores/programCollection/helpers';
import type { Props } from './RelatedStagesActions.types';
import { LinkToExisting } from '../LinkToExisting';
import { EnterDataInOrgUnit } from '../EnterDataInOrgUnit/EnterData.component';

const styles = () => ({
    wrapper: {
        padding: spacers.dp8,
        width: 'fit-content',
    },
    fieldWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: `${spacers.dp8} ${spacers.dp16}`,
    },
    fieldLabel: {
        color: colors.grey900,
        flexGrow: 0,
        flexShrink: 0,
        paddingTop: spacersNum.dp16,
        paddingRight: spacersNum.dp16,
    },
    fieldContent: {
        flexGrow: 1,
        flexShrink: 0,
    },
    clearSelections: {
        padding: spacers.dp8,
    },
});

const Schedule = ({
    actionTypesOptions,
    linkableEvents,
    selectedAction,
    updateSelectedAction,
    programStage,
    canAddNewEventToStage,
}) => {
    const { hidden, disabled, disabledMessage } =
        (actionTypesOptions && actionTypesOptions[RelatedStagesActionTypes.SCHEDULE_IN_ORG]) || {};
    if (hidden) {
        return null;
    }

    const tooltipEnabled = disabled || !canAddNewEventToStage;
    let tooltipContent = '';
    if (disabled) {
        tooltipContent = disabledMessage;
    } else if (!linkableEvents.length) {
        tooltipContent = i18n.t('{{ linkableStageLabel }} is not repeatable', {
            linkableStageLabel: programStage.stageForm.name,
            interpolation: { escapeValue: false },
        });
    }

    return (
        <ConditionalTooltip
            key={RelatedStagesActionTypes.SCHEDULE_IN_ORG}
            content={tooltipContent}
            closeDelay={50}
            enabled={tooltipEnabled}
        >
            <Radio
                name={`related-stage-action-${RelatedStagesActionTypes.SCHEDULE_IN_ORG}`}
                checked={RelatedStagesActionTypes.SCHEDULE_IN_ORG === selectedAction}
                disabled={tooltipEnabled}
                label={mainOptionTranslatedTexts[RelatedStagesActionTypes.SCHEDULE_IN_ORG]}
                onChange={(e: Object) => updateSelectedAction(e.value)}
                value={RelatedStagesActionTypes.SCHEDULE_IN_ORG}
            />
        </ConditionalTooltip>
    );
};

const EnterData = ({
    actionTypesOptions,
    linkableEvents,
    selectedAction,
    updateSelectedAction,
    programStage,
    canAddNewEventToStage,
}) => {
    const { hidden, disabled, disabledMessage } =
        (actionTypesOptions && actionTypesOptions[RelatedStagesActionTypes.ENTER_DATA]) || {};
    if (hidden) {
        return null;
    }

    const tooltipEnabled = disabled || !canAddNewEventToStage;
    let tooltipContent = '';
    if (disabled) {
        tooltipContent = disabledMessage;
    } else if (!linkableEvents.length) {
        tooltipContent = i18n.t('{{ linkableStageLabel }} is not repeatable', {
            linkableStageLabel: programStage.stageForm.name,
            interpolation: { escapeValue: false },
        });
    }

    return (
        <ConditionalTooltip
            key={RelatedStagesActionTypes.ENTER_DATA}
            content={tooltipContent}
            closeDelay={50}
            enabled={tooltipEnabled}
        >
            <Radio
                name={`related-stage-action-${RelatedStagesActionTypes.ENTER_DATA}`}
                checked={RelatedStagesActionTypes.ENTER_DATA === selectedAction}
                disabled={tooltipEnabled}
                label={mainOptionTranslatedTexts[RelatedStagesActionTypes.ENTER_DATA]}
                onChange={(e: Object) => updateSelectedAction(e.value)}
                value={RelatedStagesActionTypes.ENTER_DATA}
            />
        </ConditionalTooltip>
    );
};

const LinkExistingResponse = ({
    actionTypesOptions,
    linkableEvents,
    selectedAction,
    updateSelectedAction,
    programStage,
}) => {
    const { hidden, disabled, disabledMessage } =
        (actionTypesOptions && actionTypesOptions[RelatedStagesActionTypes.LINK_EXISTING_RESPONSE]) || {};
    if (hidden) {
        return null;
    }

    const tooltipEnabled = disabled || !linkableEvents.length;
    let tooltipContent = '';
    if (disabled) {
        tooltipContent = disabledMessage;
    } else if (!linkableEvents.length) {
        tooltipContent = i18n.t('{{ linkableStageLabel }} has no linkable events', {
            linkableStageLabel: programStage.stageForm.name,
            interpolation: { escapeValue: false },
        });
    }

    return (
        <ConditionalTooltip
            key={RelatedStagesActionTypes.LINK_EXISTING_RESPONSE}
            content={tooltipContent}
            closeDelay={50}
            enabled={tooltipEnabled}
        >
            <Radio
                name={`related-stage-action-${RelatedStagesActionTypes.LINK_EXISTING_RESPONSE}`}
                checked={RelatedStagesActionTypes.LINK_EXISTING_RESPONSE === selectedAction}
                disabled={tooltipEnabled}
                label={mainOptionTranslatedTexts[RelatedStagesActionTypes.LINK_EXISTING_RESPONSE]}
                onChange={(e: Object) => updateSelectedAction(e.value)}
                value={RelatedStagesActionTypes.LINK_EXISTING_RESPONSE}
            />
        </ConditionalTooltip>
    );
};

const RelatedStagesActionsPlain = ({
    classes,
    type,
    relationshipName,
    scheduledLabel,
    events,
    linkableEvents,
    relatedStagesDataValues,
    setRelatedStagesDataValues,
    constraint,
    errorMessages,
    saveAttempted,
    actionTypesOptions,
}: Props) => {
    const { programStage } = useProgramStageInfo(constraint?.programStage?.id);

    const selectedAction = useMemo(() => relatedStagesDataValues.linkMode, [relatedStagesDataValues.linkMode]);

    const updateSelectedAction = (action: ?$Values<typeof RelatedStagesActionTypes>) => {
        setRelatedStagesDataValues(prevState => ({
            ...prevState,
            linkMode: action,
        }));
    };
    const canAddNewEventToStage = useCanAddNewEventToStage(programStage, events);

    if (!programStage) {
        return null;
    }

    return (
        <DataSection
            dataTest="related-stages-section"
            sectionName={i18n.t('Actions - {{relationshipName}}', { relationshipName })}
        >
            <div className={classes.wrapper}>
                {type === relatedStageStatus.LINKABLE && (
                    <>
                        <Schedule
                            actionTypesOptions={actionTypesOptions}
                            linkableEvents={linkableEvents}
                            selectedAction={selectedAction}
                            updateSelectedAction={updateSelectedAction}
                            programStage={programStage}
                            canAddNewEventToStage={canAddNewEventToStage}
                        />
                        <EnterData
                            actionTypesOptions={actionTypesOptions}
                            linkableEvents={linkableEvents}
                            selectedAction={selectedAction}
                            updateSelectedAction={updateSelectedAction}
                            programStage={programStage}
                            canAddNewEventToStage={canAddNewEventToStage}
                        />
                        <LinkExistingResponse
                            actionTypesOptions={actionTypesOptions}
                            linkableEvents={linkableEvents}
                            selectedAction={selectedAction}
                            updateSelectedAction={updateSelectedAction}
                            programStage={programStage}
                        />
                    </>
                )}

                {type === relatedStageStatus.AMBIGUOUS_RELATIONSHIPS && (
                    <div>{i18n.t('Ambiguous relationships, contact system administrator')}</div>
                )}
            </div>

            {!!selectedAction && (
                <div className={classes.clearSelections}>
                    <Button
                        secondary
                        small
                        onClick={() => updateSelectedAction(undefined)}
                    >
                        {i18n.t('Clear selection')}
                    </Button>
                </div>
            )}

            {selectedAction === RelatedStagesActionTypes.SCHEDULE_IN_ORG && (
                <ScheduleInOrgUnit
                    relatedStagesDataValues={relatedStagesDataValues}
                    setRelatedStagesDataValues={setRelatedStagesDataValues}
                    scheduledLabel={scheduledLabel}
                    saveAttempted={saveAttempted}
                    errorMessages={errorMessages}
                />
            )}

            {selectedAction === RelatedStagesActionTypes.ENTER_DATA && (
                <EnterDataInOrgUnit
                    linkableStageLabel={programStage.stageForm.name}
                    relatedStagesDataValues={relatedStagesDataValues}
                    setRelatedStagesDataValues={setRelatedStagesDataValues}
                    saveAttempted={saveAttempted}
                    errorMessages={errorMessages}
                />
            )}

            {selectedAction === RelatedStagesActionTypes.LINK_EXISTING_RESPONSE && (
                <LinkToExisting
                    relatedStagesDataValues={relatedStagesDataValues}
                    setRelatedStagesDataValues={setRelatedStagesDataValues}
                    linkableEvents={linkableEvents}
                    linkableStageLabel={programStage.stageForm.name}
                    errorMessages={errorMessages}
                    saveAttempted={saveAttempted}
                />
            )}
        </DataSection>
    );
};

export const RelatedStagesActions: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(RelatedStagesActionsPlain);
