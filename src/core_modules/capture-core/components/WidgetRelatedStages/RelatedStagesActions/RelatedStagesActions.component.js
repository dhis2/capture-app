// @flow
import React, { type ComponentType, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Radio, colors, spacers, spacersNum, IconInfo16, Button } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { actions as RelatedStagesActionTypes, mainOptionTranslatedTexts, relatedStageStatus } from '../constants';
import { DataSection } from '../../DataSection';
import { ScheduleInOrgUnit } from '../ScheduleInOrgUnit';
import { useProgramStageInfo } from '../../../metaDataMemoryStores/programCollection/helpers';
import type { Props } from './RelatedStagesActions.types';
import { LinkToExisting } from '../LinkToExisting';

const styles = () => ({
    wrapper: {
        padding: `${spacers.dp8}`,
    },
    fieldWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: `${spacers.dp8}  ${spacers.dp16}`,
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
        marginTop: spacers.dp8,
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

    if (!programStage) {
        return null;
    }

    return (
        <DataSection
            dataTest="related-stages-section"
            sectionName={i18n.t('Actions: {{relationshipName}}', { relationshipName })}
        >
            <div className={classes.wrapper}>
                {type === relatedStageStatus.LINKABLE ? Object.keys(mainOptionTranslatedTexts).map(key => (
                    <Radio
                        key={key}
                        name={`related-stage-action-${key}`}
                        checked={key === selectedAction}
                        disabled={key === RelatedStagesActionTypes.LINK_EXISTING_RESPONSE && !linkableEvents.length}
                        label={mainOptionTranslatedTexts[key]}
                        onChange={(e: Object) => updateSelectedAction(e.value)}
                        value={key}
                    />
                )) : null}
                {type === relatedStageStatus.AMBIGUOUS_RELATIONSHIPS ?
                    <div>{i18n.t('Ambiguous relationships, contact system administrator')}</div>
                    : null
                }
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
            </div>

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
                <div
                    className={classes.infoBox}
                >
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

            {selectedAction === RelatedStagesActionTypes.LINK_EXISTING_RESPONSE && linkableEvents.length > 0 && (
                <LinkToExisting
                    relatedStagesDataValues={relatedStagesDataValues}
                    setRelatedStagesDataValues={setRelatedStagesDataValues}
                    linkableEvents={linkableEvents}
                    linkableStageLabel={programStage.stageForm.name}
                    errorMessages={errorMessages}
                    saveAttempted={saveAttempted}
                />
            )}

        </DataSection>);
};

export const RelatedStagesActions: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(RelatedStagesActionsPlain);
