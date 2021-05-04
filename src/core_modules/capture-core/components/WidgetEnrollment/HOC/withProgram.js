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

    if (!error) {
        log.error(errorCreator('Enrollment widget could not be loaded. Please try again later')({ error }));
        return <span>{i18n.t('Enrollment widget could not be loaded. Please try again later')} </span>;
    }

    return !loading && data?.programs ? (
        <Component {...props} program={data.programs} />
    ) : (
        <LoadingMaskElementCenter />
    );
};
