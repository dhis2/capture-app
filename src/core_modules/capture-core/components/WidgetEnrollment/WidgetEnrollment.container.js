// @flow
import React from 'react';
import { WidgetEnrollment as WidgetEnrollmentComponent } from './WidgetEnrollment.component';
import { useOrganizationUnit } from './hooks/useOrganizationUnit';
import { useTrackedEntityInstances } from './hooks/useTrackedEntityInstances';
import { useEnrollment } from './hooks/useEnrollment';
import { useProgram } from './hooks/useProgram';

type Props = {|
    teiId: string,
    enrollmentId: string,
    programId: string,
|};

export const WidgetEnrollment = ({ teiId, enrollmentId, programId }: Props) => {
    const { error: errorEnrollment, enrollment } = useEnrollment(enrollmentId);
    const { error: errorProgram, program } = useProgram(programId);
    const { error: errorOwnerOrgUnit, ownerOrgUnit } = useTrackedEntityInstances(teiId, programId);
    const { error: errorOrgUnit, displayName } = useOrganizationUnit(ownerOrgUnit);

    return (
        <WidgetEnrollmentComponent
            enrollment={enrollment}
            program={program}
            ownerOrgUnit={{ id: ownerOrgUnit, displayName }}
            loading={!(enrollment && program && displayName)}
            error={
                errorEnrollment ||
                errorProgram ||
                errorOwnerOrgUnit ||
                errorOrgUnit
            }
        />
    );
};
