import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, colors, Radio, spacers, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { relatedStageActions, mainOptionTranslatedTexts, relatedStageStatus } from '../constants';
import { useCanAddNewEventToStage } from '../hooks';
import { DataSection } from '../../DataSection';
import { ScheduleInOrgUnit } from '../ScheduleInOrgUnit';
import { useProgramStageInfo } from '../../../metaDataMemoryStores/programCollection/helpers';
import { useStageLabel, useProgramLabel } from '../../../metaData';
import type { PlainProps, LinkButtonProps } from './RelatedStagesActions.types';
import { LinkToExisting } from '../LinkToExisting';
import { EnterDataInOrgUnit } from '../EnterDataInOrgUnit/EnterData.component';

const styles: Readonly<any> = {
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
        paddingInlineEnd: spacersNum.dp16,
    },
    fieldContent: {
        flexGrow: 1,
        flexShrink: 0,
    },
    clearSelections: {
        padding: spacers.dp8,
    },
    link: {
        padding: spacers.dp8,
    },
};

const Schedule = ({
    actionsOptions,
    selectedAction,
    updateSelectedAction,
    programStage,
    canAddNewEventToStage,
    eventLabel,
}) => {
    const { hidden, disabled, disabledMessage } =
        actionsOptions?.[relatedStageActions.SCHEDULE_IN_ORG] || {};
    if (hidden) {
        return null;
    }

    const tooltipEnabled = disabled || !canAddNewEventToStage;
    let tooltipContent = '';
    if (disabled) {
        tooltipContent = disabledMessage;
    } else {
        tooltipContent = i18n.t('{{ linkableStageLabel }} can only have one {{event}}', {
            linkableStageLabel: programStage.stageForm.name,
            event: eventLabel,
            interpolation: { escapeValue: false },
        });
    }

    return (
        <ConditionalTooltip
            key={relatedStageActions.SCHEDULE_IN_ORG}
            content={tooltipContent}
            closeDelay={50}
            enabled={tooltipEnabled}
        >
            <Radio
                name={`related-stage-action-${relatedStageActions.SCHEDULE_IN_ORG}`}
                checked={relatedStageActions.SCHEDULE_IN_ORG === selectedAction}
                disabled={tooltipEnabled}
                label={mainOptionTranslatedTexts[relatedStageActions.SCHEDULE_IN_ORG]}
                onChange={e => updateSelectedAction(e.value)}
                value={relatedStageActions.SCHEDULE_IN_ORG}
                dataTest="related-stages-actions-schedule"
            />
        </ConditionalTooltip>
    );
};

const EnterData = ({
    actionsOptions,
    selectedAction,
    updateSelectedAction,
    programStage,
    canAddNewEventToStage,
    eventLabel,
}) => {
    const { hidden, disabled, disabledMessage } =
        actionsOptions?.[relatedStageActions.ENTER_DATA] || {};
    if (hidden) {
        return null;
    }

    const tooltipEnabled = disabled || !canAddNewEventToStage;
    let tooltipContent = '';
    if (disabled) {
        tooltipContent = disabledMessage;
    } else {
        tooltipContent = i18n.t('{{ linkableStageLabel }} can only have one {{event}}', {
            linkableStageLabel: programStage.stageForm.name,
            event: eventLabel,
            interpolation: { escapeValue: false },
        });
    }

    return (
        <ConditionalTooltip
            key={relatedStageActions.ENTER_DATA}
            content={tooltipContent}
            closeDelay={50}
            enabled={tooltipEnabled}
        >
            <Radio
                name={`related-stage-action-${relatedStageActions.ENTER_DATA}`}
                checked={relatedStageActions.ENTER_DATA === selectedAction}
                disabled={tooltipEnabled}
                label={mainOptionTranslatedTexts[relatedStageActions.ENTER_DATA]}
                onChange={e => updateSelectedAction(e.value)}
                value={relatedStageActions.ENTER_DATA}
                dataTest="related-stages-actions-enter-details"
            />
        </ConditionalTooltip>
    );
};

const LinkExistingResponse = ({
    actionsOptions,
    linkableEvents,
    selectedAction,
    updateSelectedAction,
    programStage,
    eventsLabel,
}) => {
    const { hidden, disabled, disabledMessage } =
        actionsOptions?.[relatedStageActions.LINK_EXISTING_RESPONSE] || {};
    if (hidden) {
        return null;
    }

    const tooltipEnabled = disabled || !linkableEvents.length;
    let tooltipContent = '';
    if (disabled) {
        tooltipContent = disabledMessage;
    } else if (!linkableEvents.length) {
        tooltipContent = i18n.t('{{ linkableStageLabel }} has no linkable {{events}}', {
            linkableStageLabel: programStage.stageForm.name,
            events: eventsLabel,
            interpolation: { escapeValue: false },
        });
    }

    return (
        <ConditionalTooltip
            key={relatedStageActions.LINK_EXISTING_RESPONSE}
            content={tooltipContent}
            closeDelay={50}
            enabled={tooltipEnabled}
        >
            <Radio
                name={`related-stage-action-${relatedStageActions.LINK_EXISTING_RESPONSE}`}
                checked={relatedStageActions.LINK_EXISTING_RESPONSE === selectedAction}
                disabled={tooltipEnabled}
                label={mainOptionTranslatedTexts[relatedStageActions.LINK_EXISTING_RESPONSE]}
                onChange={e => updateSelectedAction(e.value)}
                value={relatedStageActions.LINK_EXISTING_RESPONSE}
                dataTest="related-stages-actions-link-existing-response"
            />
        </ConditionalTooltip>
    );
};

const LinkButton = withStyles(styles)(({
    onLink, label, dataTest, isLinking, classes,
}: LinkButtonProps & WithStyles<typeof styles>) => {
    if (!onLink) {
        return null;
    }

    return (
        <div className={classes.link}>
            <Button primary small onClick={onLink} loading={isLinking} dataTest={dataTest}>
                {label}
            </Button>
        </div>
    );
});

const useRelatedStagesLabels = (stageId?: string, programId?: string) => ({
    eventLabel: useStageLabel('event', { stageId, programId }) ?? i18n.t('event'),
    eventsLabel: useStageLabel('event', { stageId, programId, plural: true }) ?? i18n.t('events'),
    relationshipsLabel: useProgramLabel('relationship', { programId, plural: true }) ?? i18n.t('relationships'),
});

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
    actionsOptions,
    onLink,
    isLinking,
}: PlainProps & WithStyles<typeof styles>) => {
    const { programStage } = useProgramStageInfo(constraint?.programStage?.id);
    const stageId = constraint?.programStage?.id;
    const programId = constraint?.programStage?.program?.id;
    const { eventLabel, eventsLabel, relationshipsLabel } = useRelatedStagesLabels(stageId, programId);

    const selectedAction = useMemo(() => relatedStagesDataValues.linkMode, [relatedStagesDataValues.linkMode]);

    const updateSelectedAction = (action: keyof typeof relatedStageActions | undefined) => {
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
                            actionsOptions={actionsOptions}
                            selectedAction={selectedAction}
                            updateSelectedAction={updateSelectedAction}
                            programStage={programStage}
                            canAddNewEventToStage={canAddNewEventToStage}
                            eventLabel={eventLabel}
                        />
                        <EnterData
                            actionsOptions={actionsOptions}
                            selectedAction={selectedAction}
                            updateSelectedAction={updateSelectedAction}
                            programStage={programStage}
                            canAddNewEventToStage={canAddNewEventToStage}
                            eventLabel={eventLabel}
                        />
                        <LinkExistingResponse
                            actionsOptions={actionsOptions}
                            linkableEvents={linkableEvents}
                            selectedAction={selectedAction}
                            updateSelectedAction={updateSelectedAction}
                            programStage={programStage}
                            eventsLabel={eventsLabel}
                        />
                    </>
                )}

                {type === relatedStageStatus.AMBIGUOUS_RELATIONSHIPS && (
                    <div>{i18n.t('Ambiguous {{relationships}}, contact system administrator', {
                        relationships: relationshipsLabel,
                    })}</div>
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

            {selectedAction === relatedStageActions.SCHEDULE_IN_ORG && (
                <>
                    <ScheduleInOrgUnit
                        relatedStagesDataValues={relatedStagesDataValues}
                        setRelatedStagesDataValues={setRelatedStagesDataValues}
                        scheduledLabel={scheduledLabel}
                        saveAttempted={saveAttempted}
                        errorMessages={errorMessages}
                    />
                    <LinkButton
                        onLink={onLink}
                        label={i18n.t('Schedule')}
                        isLinking={isLinking}
                        dataTest="related-stages-buttons-schedule"
                    />
                </>
            )}

            {selectedAction === relatedStageActions.ENTER_DATA && (
                <>
                    <EnterDataInOrgUnit
                        linkableStageLabel={programStage.stageForm.name}
                        relatedStagesDataValues={relatedStagesDataValues}
                        setRelatedStagesDataValues={setRelatedStagesDataValues}
                        saveAttempted={saveAttempted}
                        errorMessages={errorMessages}
                    />
                    <LinkButton
                        onLink={onLink}
                        label={i18n.t('Enter details')}
                        isLinking={isLinking}
                        dataTest="related-stages-buttons-enter-details"
                    />
                </>
            )}

            {selectedAction === relatedStageActions.LINK_EXISTING_RESPONSE && (
                <>
                    <LinkToExisting
                        relatedStagesDataValues={relatedStagesDataValues}
                        setRelatedStagesDataValues={setRelatedStagesDataValues}
                        linkableEvents={linkableEvents}
                        linkableStageLabel={programStage.stageForm.name}
                        errorMessages={errorMessages}
                        saveAttempted={saveAttempted}
                    />
                    <LinkButton
                        onLink={onLink}
                        label={i18n.t('Link')}
                        isLinking={isLinking}
                        dataTest="related-stages-buttons-link-existing-response"
                    />
                </>
            )}

        </DataSection>
    );
};

export const RelatedStagesActions = withStyles(styles)(RelatedStagesActionsPlain);
