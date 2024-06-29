// @flow
import React, { type ComponentType, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Radio, colors, spacers, spacersNum, IconInfo16, Button } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { actions as RelatedStagesActionTypes, mainOptionTranslatedTexts, relatedStageStatus } from '../constants';
import { useCanAddNewEventToStage } from '../hooks/useCanAddNewEventToStage';
import { DataSection } from '../../DataSection';
import { ScheduleInOrgUnit } from '../ScheduleInOrgUnit';
import { useProgramStageInfo } from '../../../metaDataMemoryStores/programCollection/helpers';
import type { Props } from './RelatedStagesActions.types';
import { LinkToExisting } from '../LinkToExisting';

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
    infoBox: {
        margin: '8px 8px',
        display: 'flex',
        fontSize: '14px',
        gap: '5px',
        background: colors.grey100,
        padding: '12px 8px',
        border: `1px solid ${colors.grey600}`,
    },
});

export const RelatedStagesActionsPlain = ({
    classes,
    type,
    relationshipName,
    scheduledLabel,
    linkableEvents,
    relatedStagesDataValues,
    setRelatedStagesDataValues,
    constraint,
    currentStageLabel,
    errorMessages,
    saveAttempted,
}: Props) => {
    const { programStage } = useProgramStageInfo(constraint?.programStage?.id);

    const selectedAction = useMemo(() => relatedStagesDataValues.linkMode, [relatedStagesDataValues.linkMode]);

    const updateSelectedAction = (action: ?$Values<typeof RelatedStagesActionTypes>) => {
        setRelatedStagesDataValues(prevState => ({
            ...prevState,
            linkMode: action,
        }));
    };

    const canAddNewEventToStage = useCanAddNewEventToStage(programStage, linkableEvents);

    if (!programStage) {
        return null;
    }

    return (
        <DataSection
            dataTest="related-stages-section"
            sectionName={i18n.t('Actions: {{relationshipName}}', { relationshipName })}
        >
            <div className={classes.wrapper}>
                {type === relatedStageStatus.LINKABLE && (
                    <>
                        <ConditionalTooltip
                            key={RelatedStagesActionTypes.SCHEDULE_IN_ORG}
                            content={i18n.t('{{ linkableStageLabel }} is not repeatable', {
                                linkableStageLabel: programStage.stageForm.name,
                                interpolation: { escapeValue: false },
                            })}
                            closeDelay={50}
                            enabled={!canAddNewEventToStage}
                        >
                            <Radio
                                name={`related-stage-action-${RelatedStagesActionTypes.SCHEDULE_IN_ORG}`}
                                checked={RelatedStagesActionTypes.SCHEDULE_IN_ORG === selectedAction}
                                disabled={!canAddNewEventToStage}
                                label={mainOptionTranslatedTexts[RelatedStagesActionTypes.SCHEDULE_IN_ORG]}
                                onChange={(e: Object) => updateSelectedAction(e.value)}
                                value={RelatedStagesActionTypes.SCHEDULE_IN_ORG}
                            />
                        </ConditionalTooltip>
                        <ConditionalTooltip
                            key={RelatedStagesActionTypes.ENTER_DATA}
                            content={i18n.t('{{ linkableStageLabel }} is not repeatable', {
                                linkableStageLabel: programStage.stageForm.name,
                                interpolation: { escapeValue: false },
                            })}
                            closeDelay={50}
                            enabled={!canAddNewEventToStage}
                        >
                            <Radio
                                name={`related-stage-action-${RelatedStagesActionTypes.ENTER_DATA}`}
                                checked={RelatedStagesActionTypes.ENTER_DATA === selectedAction}
                                disabled={!canAddNewEventToStage}
                                label={mainOptionTranslatedTexts[RelatedStagesActionTypes.ENTER_DATA]}
                                onChange={(e: Object) => updateSelectedAction(e.value)}
                                value={RelatedStagesActionTypes.ENTER_DATA}
                            />
                        </ConditionalTooltip>
                        <ConditionalTooltip
                            key={RelatedStagesActionTypes.LINK_EXISTING_RESPONSE}
                            content={i18n.t('{{ linkableStageLabel }} has no existing events', {
                                linkableStageLabel: programStage.stageForm.name,
                                interpolation: { escapeValue: false },
                            })}
                            closeDelay={50}
                            enabled={!linkableEvents.length}
                        >
                            <Radio
                                name={`related-stage-action-${RelatedStagesActionTypes.LINK_EXISTING_RESPONSE}`}
                                checked={RelatedStagesActionTypes.LINK_EXISTING_RESPONSE === selectedAction}
                                disabled={!linkableEvents.length}
                                label={mainOptionTranslatedTexts[RelatedStagesActionTypes.LINK_EXISTING_RESPONSE]}
                                onChange={(e: Object) => updateSelectedAction(e.value)}
                                value={RelatedStagesActionTypes.LINK_EXISTING_RESPONSE}
                            />
                        </ConditionalTooltip>
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
                <div className={classes.infoBox}>
                    <IconInfo16 />
                    {i18n.t(
                        'Enter {{linkableStageLabel}} details in the next step after completing this {{currentStageLabel}}.',
                        {
                            linkableStageLabel: programStage.stageForm.name,
                            currentStageLabel,
                        },
                    )}
                </div>
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
