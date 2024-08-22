// @flow
import React, { useMemo } from 'react';
import { compose } from 'redux';
import i18n from '@dhis2/d2-i18n';
import { NoticeBox, spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { useEnrollmentAddEventTopBar, EnrollmentAddEventTopBar } from './TopBar';
import { EnrollmentAddEventPageDefault } from './EnrollmentAddEventPageDefault/EnrollmentAddEventPageDefault.container';
import { useLocationQuery } from '../../../utils/routing';
import {
    IdTypes,
    useValidatedIDsFromCache,
} from '../../../utils/cachedDataHooks/useValidatedIDsFromCache';
import { useCommonEnrollmentDomainData } from '../common/EnrollmentOverviewDomain';
import { EnrollmentAddEventPageStatuses } from './EnrollmentAddEventPage.constants';
import { LoadingMaskForPage } from '../../LoadingMasks';
import { type Props } from './EnrollmentAddEventPage.types';
import {
    useEnrollmentPageLayout,
} from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout/hooks/useEnrollmentPageLayout';
import { DataStoreKeyByPage } from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import { DefaultPageLayout } from './PageLayout/DefaultPageLayout.constants';
import { useProgramInfo } from '../../../hooks/useProgramInfo';

const getStyles = () => ({
    container: {
        padding: '24px 24px 16px 24px',
    },
    informativeMessage: {
        marginLeft: spacersNum.dp16,
        marginTop: spacersNum.dp24,
        marginRight: spacersNum.dp16,
    },
});

const EnrollmentAddEventPagePlain = ({ classes }: Props) => {
    const { teiId, programId, orgUnitId, enrollmentId, stageId } = useLocationQuery();
    const { valid: validIds, loading, error: validatedIdsError } = useValidatedIDsFromCache({ programId, orgUnitId });
    const {
        enrollment,
        attributeValues,
        error: commonDataError,
    } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const { pageLayout, isLoading } = useEnrollmentPageLayout({
        selectedScopeId: validIds[IdTypes.PROGRAM_ID]?.id,
        dataStoreKey: DataStoreKeyByPage.ENROLLMENT_EVENT_NEW,
        defaultPageLayout: DefaultPageLayout,
    });

    const { program } = useProgramInfo(programId);
    const selectedProgramStage = program?.stages.get(stageId);
    const trackedEntityName = program?.trackedEntityType?.name;

    const {
        handleSetOrgUnitId,
        handleResetOrgUnitId,
        handleResetProgramId,
        handleResetEnrollmentId,
        handleResetTeiId,
        handleResetStageId,
        handleResetEventId,
        teiDisplayName,
        enrollmentsAsOptions,
        teiSelectorFailure,
        userInteractionInProgress,
    } = useEnrollmentAddEventTopBar(teiId, programId, enrollment);

    const pageIsInvalid = (!loading && !Object.values(validIds)?.every(Id => Id?.valid)) || commonDataError || validatedIdsError;
    const pageStatus = useMemo(() => {
        if (!programId || !enrollmentId || !teiId) {
            return EnrollmentAddEventPageStatuses.MISSING_REQUIRED_VALUES;
        }
        if (pageIsInvalid && validIds[IdTypes.PROGRAM_ID]?.valid && !validIds[IdTypes.ORG_UNIT_ID]?.valid) {
            return EnrollmentAddEventPageStatuses.ORG_UNIT_INVALID;
        }
        if (pageIsInvalid && !validIds[IdTypes.PROGRAM_ID]?.valid) {
            return EnrollmentAddEventPageStatuses.PROGRAM_INVALID;
        }
        if (pageIsInvalid) {
            return EnrollmentAddEventPageStatuses.PAGE_INVALID;
        }
        if (loading || isLoading) {
            return EnrollmentAddEventPageStatuses.LOADING;
        }
        return EnrollmentAddEventPageStatuses.DEFAULT;
    }, [enrollmentId, isLoading, loading, pageIsInvalid, programId, teiId, validIds]);

    const getErrorMessage = () => {
        switch (pageStatus) {
            case EnrollmentAddEventPageStatuses.MISSING_REQUIRED_VALUES:
                return i18n.t('Page is missing required values from URL');
            case EnrollmentAddEventPageStatuses.PROGRAM_INVALID:
                return i18n.t('Program is not valid');
            case EnrollmentAddEventPageStatuses.ORG_UNIT_INVALID:
                return i18n.t('Org unit is not valid with current program');
            case EnrollmentAddEventPageStatuses.PAGE_INVALID:
                return i18n.t('There was an error opening the Page');
            default:
                return '';
        }
    };

    const renderContent = () => {
        if (pageStatus === EnrollmentAddEventPageStatuses.LOADING) {
            return <LoadingMaskForPage />;
        }
    
        if (pageStatus === EnrollmentAddEventPageStatuses.DEFAULT) {
            return (
                <EnrollmentAddEventPageDefault
                    // $FlowFixMe - Business logic dictates that pageLayout is defined
                    pageLayout={pageLayout}
                    enrollment={enrollment}
                    attributeValues={attributeValues}
                    commonDataError={Boolean(commonDataError)}
                />
            );
        }
    
        return (
            <div className={classes.informativeMessage}>
                <NoticeBox
                    error
                >
                    {getErrorMessage()}
                </NoticeBox>
            </div>
        );
    };


    return (
        <>
            <EnrollmentAddEventTopBar
                programId={programId}
                orgUnitId={orgUnitId}
                enrollmentId={enrollmentId}
                teiDisplayName={teiDisplayName}
                trackedEntityName={trackedEntityName}
                stageName={selectedProgramStage?.stageForm.name}
                stageIcon={selectedProgramStage?.icon}
                eventDateLabel={selectedProgramStage?.stageForm.getLabel('occurredAt')}
                enrollmentsAsOptions={enrollmentsAsOptions}
                onSetOrgUnitId={handleSetOrgUnitId}
                onResetOrgUnitId={handleResetOrgUnitId}
                onResetProgramId={handleResetProgramId}
                onResetEnrollmentId={handleResetEnrollmentId}
                onResetTeiId={handleResetTeiId}
                onResetStageId={handleResetStageId}
                onResetEventId={handleResetEventId}
                userInteractionInProgress={userInteractionInProgress}
                teiSelectorFailure={teiSelectorFailure}
                enrollmentSelectorFailure={commonDataError}
            />
            <div data-test="enrollment-add-event-page-content" className={classes.container}>
                {renderContent()}
            </div>
        </>
    );
};

export const EnrollmentAddEventPage = compose(
    withStyles(getStyles),
)(EnrollmentAddEventPagePlain);
