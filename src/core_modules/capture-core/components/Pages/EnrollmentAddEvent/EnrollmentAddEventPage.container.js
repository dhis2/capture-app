// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { NoticeBox, spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
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

const styles = {
    informativeMessage: {
        marginLeft: spacersNum.dp16,
        marginTop: spacersNum.dp24,
        marginRight: spacersNum.dp16,
    },
};
const EnrollmentAddEventPagePlain = ({ classes }: Props) => {
    const { teiId, programId, orgUnitId, enrollmentId } = useLocationQuery();
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

    // $FlowFixMe
    const pageIsInvalid = (!loading && !Object.values(validIds)?.every(Id => Id?.valid)) || commonDataError || validatedIdsError;
    const pageStatus = useMemo(() => {
        if (!programId || !enrollmentId || !teiId) {
            return EnrollmentAddEventPageStatuses.MISSING_REQUIRED_VALUES;
        }
        // $FlowFixMe[prop-missing]
        if (pageIsInvalid && validIds[IdTypes.PROGRAM_ID]?.valid && !validIds[IdTypes.ORG_UNIT_ID]?.valid) {
            return EnrollmentAddEventPageStatuses.ORG_UNIT_INVALID;
        }
        // $FlowFixMe[prop-missing]
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
                title={'An error has occurred'}
            >
                {pageStatus === EnrollmentAddEventPageStatuses.MISSING_REQUIRED_VALUES && (
                    i18n.t('Page is missing required values from URL')
                )}

                {pageStatus === EnrollmentAddEventPageStatuses.PROGRAM_INVALID && (
                    i18n.t('Program is not valid')
                )}

                {pageStatus === EnrollmentAddEventPageStatuses.ORG_UNIT_INVALID && (
                    i18n.t('Org unit is not valid with current program')
                )}

                {pageStatus === EnrollmentAddEventPageStatuses.PAGE_INVALID && (
                    i18n.t('There was an error opening the Page')
                )}
            </NoticeBox>
        </div>
    );
};

export const EnrollmentAddEventPage = withStyles(styles)(EnrollmentAddEventPagePlain);
