// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { Button, spacers, colors } from '@dhis2/ui';
import { DataEntry } from './DataEntry/DataEntry.container';
import { EventsList } from './RecentlyAddedEventsList/RecentlyAddedEventsList.container';
import { useScopeTitleText } from '../../../../hooks/useScopeTitleText';
import { useCurrentProgramInfo } from '../../../../hooks/useCurrentProgramInfo';
import { useCoreOrgUnit } from '../../../../metadataRetrieval/coreOrgUnit';
import { useLocationQuery } from '../../../../utils/routing';
import { useRulesEngine } from './useRulesEngine';
import type { PlainProps } from './NewEventDataEntryWrapper.types';
import { useMetadataForProgramStage } from '../../common/ProgramStage/useMetadataForProgramStage';
import { useProgramExpiryForUser } from '../../../../hooks';
import { LoadingMaskForPage } from '../../../LoadingMasks';

const getStyles = () => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'top',
        justifyContent: 'space-between',
        marginBottom: spacers.dp12,
    },
    flexEnd: {
        justifyContent: 'flex-end',
        flexShrink: 0,
    },
    container: {
        marginBottom: spacers.dp16,
        padding: spacers.dp16,
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
        color: colors.grey900,
    },
    title: {
        fontWeight: 500,
        fontSize: 16,
        color: colors.grey800,
    },
});

const NewEventDataEntryWrapperPlain = ({
    classes,
    formHorizontal,
    onFormLayoutDirectionChange,
}: PlainProps) => {
    const { id: programId } = useCurrentProgramInfo();
    const orgUnitId = useLocationQuery().orgUnitId;
    const { formFoundation, stage, isLoading } = useMetadataForProgramStage({ programId });
    const { orgUnit: orgUnitContext, error } = useCoreOrgUnit(orgUnitId);
    const rulesReady = useRulesEngine({ programId, orgUnitContext, formFoundation });
    const titleText = useScopeTitleText(programId);
    const expiryPeriod = useProgramExpiryForUser(programId);

    if (error) {
        return error.errorComponent;
    }

    const checkIfCustomForm = () => {
        let isCustom = false;
        if (!formFoundation?.sections) { return isCustom; }
        formFoundation.sections.forEach((section) => {
            section.customForm ? isCustom = true : null;
        });
        return isCustom;
    };
    const isCustomForm = checkIfCustomForm();

    if (isLoading || !rulesReady) {
        return <LoadingMaskForPage />;
    }

    return (
        <div className={classes.container}>
            <div className={classes.flexContainer}>
                <div className={classes.title} >
                    {i18n.t('New {{titleText}}', {
                        titleText,
                        interpolation: { escapeValue: false },
                    })}
                </div>
                <div className={classes.flexEnd}>
                    {
                        isCustomForm ?
                            null
                            :
                            <Button
                                onClick={() => onFormLayoutDirectionChange(!formHorizontal)}
                                small
                            >
                                {
                                    formHorizontal
                                        ?
                                        i18n.t('Switch to form view')
                                        :
                                        i18n.t('Switch to row view')
                                }
                            </Button>

                    }
                </div>
            </div>
            <div>
                <DataEntry
                    programId={programId}
                    stage={stage}
                    orgUnit={orgUnitContext}
                    formFoundation={formFoundation}
                    formHorizontal={formHorizontal}
                    expiryPeriod={expiryPeriod}
                />
                <EventsList />
            </div>
        </div>
    );
};

export const NewEventDataEntryWrapperComponent = withStyles(getStyles)(NewEventDataEntryWrapperPlain);
