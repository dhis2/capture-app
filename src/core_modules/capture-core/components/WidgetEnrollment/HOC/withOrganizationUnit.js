// @flow
import React, { useMemo, type ComponentType } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';
import { LoadingMaskElementCenter } from '../../LoadingMasks';

type Props = {
    ownerOrgUnit: string,
};

export const withOrganizationUnit = (Component: ComponentType<any>) => (
    props: Props,
) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                organisationUnits: {
                    resource: `organisationUnits/${props.ownerOrgUnit}`,
                    params: {
                        fields: ['displayName'],
                    },
                },
            }),
            [props.ownerOrgUnit],
        ),
    );

    if (error) {
        log.error(errorCreator('Enrollment widget could not be loaded. Please try again later')({ error }));
        return <span>{i18n.t('Enrollment widget could not be loaded. Please try again later')} </span>;
    }

    return !loading && data?.organisationUnits?.displayName ? (
        <Component
            {...props}
            ownerOrgUnit={{
                ...props.ownerOrgUnit,
                displayName: data.organisationUnits.displayName,
            }}
        />
    ) : (
        <LoadingMaskElementCenter />
    );
};
