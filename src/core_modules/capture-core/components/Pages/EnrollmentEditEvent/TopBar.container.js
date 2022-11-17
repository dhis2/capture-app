// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import Grid from '@material-ui/core/Grid';
import { dataEntryKeys } from 'capture-core/constants';
import type { ProgramStage } from '../../../metaData';
import { pageStatuses } from './EnrollmentEditEventPage.constants';
import {
    ScopeSelector,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
    useResetTeiId,
    useResetEnrollmentId,
    useResetStageId,
    useResetEventId,
} from '../../ScopeSelector';
import { SingleLockedSelect } from '../../ScopeSelector/QuickSelector/SingleLockedSelect.component';
import { TopBarActions } from '../../TopBarActions';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';

type Props = {|
    programStage: ?ProgramStage,
    enrollmentId: string,
    programId: string,
    mode: string,
    orgUnitId: string,
    trackedEntityName: string,
    teiDisplayName: string,
    eventDate?: string,
    enrollmentsAsOptions: Array<Object>,
    pageStatus: string,
    teiId: string,
|};

export const TopBar = ({
    mode,
    programStage,
    enrollmentId,
    programId,
    enrollmentsAsOptions,
    trackedEntityName,
    teiDisplayName,
    orgUnitId,
    teiId,
    eventDate,
    pageStatus,
}: Props) => {
    const { setOrgUnitId } = useSetOrgUnitId();

    const { resetProgramIdAndEnrollmentContext } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { resetEnrollmentId } = useResetEnrollmentId();
    const { resetTeiId } = useResetTeiId();
    const { resetStageId } = useResetStageId();
    const { resetEventId } = useResetEventId();
    const isUserInteractionInProgress = mode === dataEntryKeys.EDIT;

    return (
        <ScopeSelector
            selectedProgramId={programId}
            selectedOrgUnitId={orgUnitId}
            onSetOrgUnit={id => setOrgUnitId(id)}
            onResetProgramId={() => resetProgramIdAndEnrollmentContext('enrollment', { teiId })}
            onResetOrgUnitId={() => resetOrgUnitId()}
            isUserInteractionInProgress={isUserInteractionInProgress}
        >
            <Grid item xs={12} sm={6} md={4} lg={2}>
                <SingleLockedSelect
                    ready={pageStatus !== pageStatuses.MISSING_DATA}
                    onClear={() => resetTeiId('/', { programId })}
                    options={[
                        {
                            label: teiDisplayName,
                            value: 'alwaysPreselected',
                        },
                    ]}
                    selectedValue="alwaysPreselected"
                    title={trackedEntityName}
                    isUserInteractionInProgress={isUserInteractionInProgress}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
                <SingleLockedSelect
                    ready={pageStatus !== pageStatuses.MISSING_DATA}
                    onClear={() => resetEnrollmentId('enrollment', { programId, teiId })}
                    options={enrollmentsAsOptions}
                    selectedValue={enrollmentId}
                    title={i18n.t('Enrollment')}
                    isUserInteractionInProgress={isUserInteractionInProgress}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
                <SingleLockedSelect
                    ready={pageStatus !== pageStatuses.MISSING_DATA}
                    onClear={() => resetStageId('enrollment', { enrollmentId })}
                    options={[
                        {
                            label: programStage?.name || '',
                            value: 'alwaysPreselected',
                        },
                    ]}
                    selectedValue="alwaysPreselected"
                    title={i18n.t('stage')}
                    isUserInteractionInProgress={isUserInteractionInProgress}
                />
            </Grid>
            {programStage && (
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={pageStatus !== pageStatuses.MISSING_DATA}
                        onClear={() => resetEventId('enrollment', { enrollmentId })}
                        options={[
                            {
                                label: eventDate || '',
                                value: 'alwaysPreselected',
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={programStage.stageForm.getLabel('occurredAt')}
                        isUserInteractionInProgress={isUserInteractionInProgress}
                    />
                </Grid>
            )}
            <Grid item xs={12} sm={6} md={6} lg={2}>
                <TopBarActions
                    selectedProgramId={programId}
                    selectedOrgUnitId={orgUnitId}
                    isUserInteractionInProgress={mode === dataEntryKeys.EDIT}
                />
            </Grid>
        </ScopeSelector>
    );
};
