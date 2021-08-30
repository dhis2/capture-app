// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';
import { useEnrollment } from '../common/EnrollmentOverviewDomain/useEnrollment';
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { buildEnrollmentsAsOptions } from '../../ScopeSelector';
import { getScopeInfo } from '../../../metaData';

export const EnrollmentAddEventPage = () => {
    const { programId, stageId, teiId, enrollmentId, orgUnitId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
            orgUnitId: query.orgUnitId,
            enrollmentId: query.enrollmentId,
            teiId: query.teiId,
        }),
        shallowEqual,
    );
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages.values()].find(item => item.id === stageId);
    const enrollmentSite = useEnrollment(teiId).enrollment;
    const { teiDisplayName } = useTeiDisplayName(teiId, programId);
    const { trackedEntityName } = getScopeInfo(enrollmentSite.trackedEntityType);
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollmentSite], programId);

    if (!programStage) {
        return <span>[program stage placeholder]</span>;
    }
    return (
        <EnrollmentAddEventPageComponent
            programStage={programStage}
            programId={programId}
            orgUnitId={orgUnitId}
            enrollmentsAsOptions={enrollmentsAsOptions}
            teiDisplayName={teiDisplayName}
            trackedEntityName={trackedEntityName}
            enrollmentId={enrollmentId}
        />
    );
};
