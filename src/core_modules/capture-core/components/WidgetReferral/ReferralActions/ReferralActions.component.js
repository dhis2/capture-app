// @flow
import React, { type ComponentType, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Radio, colors, spacers, spacersNum, IconInfo16, IconWarning16 } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { actions as ReferralActionTypes, mainOptionTranslatedTexts, referralStatus } from '../constants';
import { DataSection } from '../../DataSection';
import { ReferToOrgUnit } from '../ReferToOrgUnit';
import { useProgramStageInfo } from '../../../metaDataMemoryStores/programCollection/helpers';
import type { Props } from './ReferralActions.types';
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

export const ReferralActionsPlain = ({
    classes,
    type,
    scheduledLabel,
    linkableEvents,
    referralDataValues,
    setReferralDataValues,
    constraint,
    currentStageLabel,
    errorMessages,
    saveAttempted,
}: Props) => {
    const { programStage } = useProgramStageInfo(constraint?.programStage?.id);

    const selectedAction = useMemo(() => referralDataValues.referralMode, [referralDataValues.referralMode]);

    const updateSelectedAction = (action: $Values<typeof ReferralActionTypes>) => {
        setReferralDataValues(prevState => ({
            ...prevState,
            referralMode: action,
        }));
    };

    if (!programStage) {
        return null;
    }

    return (
        <DataSection
            dataTest="referral-section"
            sectionName={i18n.t('Referral actions')}
        >
            <div className={classes.wrapper}>
                {type === referralStatus.REFERRABLE ? Object.keys(mainOptionTranslatedTexts).map(key => (
                    <Radio
                        key={key}
                        name={`referral-action-${key}`}
                        checked={key === selectedAction}
                        disabled={key === ReferralActionTypes.LINK_EXISTING_RESPONSE && !linkableEvents.length}
                        label={mainOptionTranslatedTexts[key](programStage.stageForm.name)}
                        onChange={(e: Object) => updateSelectedAction(e.value)}
                        value={key}
                    />
                )) : null}
                {type === referralStatus.AMBIGUOUS_REFERRALS ?
                    <div>{i18n.t('Ambiguous referrals, contact system administrator')}</div>
                    : null
                }
            </div>

            {selectedAction === ReferralActionTypes.REFER_ORG && (
                <ReferToOrgUnit
                    referralDataValues={referralDataValues}
                    setReferralDataValues={setReferralDataValues}
                    scheduledLabel={scheduledLabel}
                    saveAttempted={saveAttempted}
                    errorMessages={errorMessages}
                />
            )}

            {selectedAction === ReferralActionTypes.ENTER_DATA && (
                <div
                    className={classes.infoBox}
                >
                    <IconInfo16 />
                    {i18n.t(
                        'Enter {{referralProgramStageLabel}} details in the next step after completing this {{currentStageLabel}}.',
                        {
                            referralProgramStageLabel: programStage.stageForm.name,
                            currentStageLabel,
                        },
                    )}
                </div>
            )}

            {selectedAction === ReferralActionTypes.LINK_EXISTING_RESPONSE && linkableEvents.length > 0 && (
                <LinkToExisting
                    referralDataValues={referralDataValues}
                    setReferralDataValues={setReferralDataValues}
                    linkableEvents={linkableEvents}
                    referralProgramStageLabel={programStage.stageForm.name}
                    errorMessages={errorMessages}
                    saveAttempted={saveAttempted}
                />
            )}

            {selectedAction === ReferralActionTypes.DO_NOT_LINK_RESPONSE && (
                <div
                    className={classes.infoBox}
                >
                    <IconWarning16 />
                    {i18n.t(
                        'This {{currentStageLabel}} will be created without a link to {{referralProgramStageLabel}}',
                        {
                            referralProgramStageLabel: programStage.stageForm.name,
                            currentStageLabel,
                        },
                    )}
                </div>
            )}
        </DataSection>);
};

export const ReferralActions: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ReferralActionsPlain);
