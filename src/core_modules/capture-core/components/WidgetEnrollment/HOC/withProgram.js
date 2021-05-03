// @flow
import React, { useMemo, type ComponentType } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { LoadingMaskElementCenter } from '../../LoadingMasks';

type Props = {
    programId: string,
};
const ENROLLMENT_RETRIEVE_ERROR =
    'Enrollment widget could not be loaded. Please try again later';

export const withProgram = (Component: ComponentType<any>) => (
    props: Props,
) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                programs: {
                    resource: `programs/${props.programId}`,
                    params: {
                        fields: [
                            'displayIncidentDate,incidentDateLabel,enrollmentDateLabel',
                        ],
                    },
                },
            }),
            [props.programId],
        ),
    );

    if (error) {
        log.error(errorCreator(ENROLLMENT_RETRIEVE_ERROR)({ error }));
        return <span>{i18n.t(ENROLLMENT_RETRIEVE_ERROR)} </span>;
    }

    return !loading && data?.programs ? (
        <Component {...props} program={data.programs} />
    ) : (
        <LoadingMaskElementCenter />
    );
};
