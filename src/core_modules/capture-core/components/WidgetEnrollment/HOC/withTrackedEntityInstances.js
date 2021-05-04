// @flow
import React, { useMemo, type ComponentType } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';
import { LoadingMaskElementCenter } from '../../LoadingMasks';

type Props = {
    programId: string,
    teiId: string,
};

export const withTrackedEntityInstances = (Component: ComponentType<any>) => (
    props: Props,
) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstances: {
                    resource: `trackedEntityInstances/${props.teiId}`,
                    params: {
                        fields: ['programOwners[ownerOrgUnit]'],
                        program: [props.programId],
                    },
                },
            }),
            [props.teiId, props.programId],
        ),
    );

    if (error) {
        log.error(errorCreator('Enrollment widget could not be loaded. Please try again later')({ error }));
        return <span>{i18n.t('Enrollment widget could not be loaded. Please try again later')} </span>;
    }

    return !loading &&
        data?.trackedEntityInstances?.programOwners[0]?.ownerOrgUnit ? (
            <Component
                {...props}
                ownerOrgUnit={
                    data.trackedEntityInstances.programOwners[0].ownerOrgUnit
                }
            />
        ) : (
            <LoadingMaskElementCenter />
        );
};
