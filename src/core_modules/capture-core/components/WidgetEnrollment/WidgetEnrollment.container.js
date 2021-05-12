// @flow
import React from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { WidgetEnrollment as WidgetEnrollmentComponent } from './WidgetEnrollment.component';
import { useOrganizationUnit } from './hooks/useOrganizationUnit';
import { useTrackedEntityInstances } from './hooks/useTrackedEntityInstances';
import { useEnrollment } from './hooks/useEnrollment';
import { useProgram } from './hooks/useProgram';
import { LoadingMaskElementCenter } from '../LoadingMasks';

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

    if (errorEnrollment || errorProgram || errorOwnerOrgUnit || errorOrgUnit) {
        log.error(errorCreator('Enrollment widget could not be loaded'));
        return (
            <span>
                {i18n.t(
                    'Enrollment widget could not be loaded. Please try again later',
                )}
            </span>
        );
    }

    return enrollment && program && displayName ? (
        <WidgetEnrollmentComponent
            enrollment={enrollment}
            program={program}
            ownerOrgUnit={{ id: ownerOrgUnit, displayName }}
        />
    ) : (
        <LoadingMaskElementCenter />
    );
};
