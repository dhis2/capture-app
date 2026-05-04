import React, { useMemo, useEffect } from 'react';
import i18n from '@dhis2/d2-i18n';
import { NoticeBox, spacersNum } from '@dhis2/ui';
import { WithStyles, withStyles } from 'capture-core-utils/styles';
import type { ComponentType } from 'react';
import { EnrollmentAddEventPageDefault } from './EnrollmentAddEventPageDefault/EnrollmentAddEventPageDefault.container';
import { useNavigate, useLocationQuery, buildUrlQueryString } from '../../../utils/routing';
import {
    IdTypes,
    useValidatedIDsFromCache,
} from '../../../utils/cachedDataHooks/useValidatedIDsFromCache';
import { useCommonEnrollmentDomainData } from '../common/EnrollmentOverviewDomain';
import { EnrollmentAddEventPageStatuses } from './EnrollmentAddEventPage.constants';
import { LoadingMaskForPage } from '../../LoadingMasks';
import {
    useEnrollmentPageLayout,
} from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout/hooks/useEnrollmentPageLayout';
import { DataStoreKeyByPage } from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import { DefaultPageLayout } from './PageLayout/DefaultPageLayout.constants';

const getInvalidPageStatus = (validIds: any) => {
    const isProgramIdInvalid = !validIds[IdTypes.PROGRAM_ID]?.valid;
    if (!isProgramIdInvalid && !validIds[IdTypes.ORG_UNIT_ID]?.valid) {
        return EnrollmentAddEventPageStatuses.ORG_UNIT_INVALID;
    }
    if (isProgramIdInvalid) return EnrollmentAddEventPageStatuses.PROGRAM_INVALID;
    return EnrollmentAddEventPageStatuses.PAGE_INVALID;
};

const determinePageStatus = ({
    programId,
    enrollmentId,
    teiId,
    pageIsInvalid,
    validIds,
    loading,
    isLoading,
}: {
    programId?: string;
    enrollmentId?: string;
    teiId?: string;
    pageIsInvalid: any;
    validIds: any;
    loading: boolean;
    isLoading: boolean;
}) => {
    if (!programId || !enrollmentId || !teiId) {
        return EnrollmentAddEventPageStatuses.MISSING_REQUIRED_VALUES;
    }
    if (pageIsInvalid) return getInvalidPageStatus(validIds);
    if (loading || isLoading) return EnrollmentAddEventPageStatuses.LOADING;
    return EnrollmentAddEventPageStatuses.DEFAULT;
};

type Props = WithStyles<typeof styles>;

const styles = {
    informativeMessage: {
        marginInline: spacersNum.dp16,
        marginTop: spacersNum.dp24,
    },
};
const EnrollmentAddEventPagePlain = ({ classes }: WithStyles<typeof styles>) => {
    const { navigate } = useNavigate();
    const { teiId, programId, orgUnitId, enrollmentId } = useLocationQuery();
    const { valid: validIds, loading, error: validatedIdsError } = useValidatedIDsFromCache({ programId, orgUnitId });
    const {
        enrollment,
        attributeValues,
        error: commonDataError,
    } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const { pageLayout, isLoading } = useEnrollmentPageLayout({
        selectedScopeId: validIds[IdTypes.PROGRAM_ID]?.id ?? null,
        dataStoreKey: DataStoreKeyByPage.ENROLLMENT_EVENT_NEW,
        defaultPageLayout: DefaultPageLayout,
    });

    const pageIsInvalid = (!loading &&
        !Object.values(validIds)?.every(Id => Id?.valid)) || commonDataError || validatedIdsError;

    const pageStatus = useMemo(
        () => determinePageStatus({ programId, enrollmentId, teiId, pageIsInvalid, validIds, loading, isLoading }),
        [programId, enrollmentId, teiId, pageIsInvalid, validIds, loading, isLoading],
    );

    useEffect(() => {
        if (pageStatus === EnrollmentAddEventPageStatuses.PROGRAM_INVALID) {
            navigate(`/enrollment?${buildUrlQueryString({ orgUnitId, teiId, enrollmentId })}`);
        }
    }, [pageStatus, orgUnitId, teiId, enrollmentId, navigate]);

    if (pageStatus === EnrollmentAddEventPageStatuses.LOADING) {
        return <LoadingMaskForPage />;
    }

    if (pageStatus === EnrollmentAddEventPageStatuses.DEFAULT) {
        return (
            <EnrollmentAddEventPageDefault
                pageLayout={pageLayout!}
                enrollment={enrollment}
                attributeValues={attributeValues as Record<string, unknown> | null | undefined}
                commonDataError={Boolean(commonDataError)}
            />
        );
    }

    return (
        <div className={classes.informativeMessage}>
            <NoticeBox
                error
                title={i18n.t('An error has occurred')}
            >
                {pageStatus === EnrollmentAddEventPageStatuses.MISSING_REQUIRED_VALUES && (
                    i18n.t('Page is missing required values from URL')
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

export const EnrollmentAddEventPage: ComponentType<Props> = withStyles(styles)(
    EnrollmentAddEventPagePlain,
) as ComponentType<Props>;
