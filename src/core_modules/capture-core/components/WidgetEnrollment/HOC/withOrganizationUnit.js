// @flow
import React, { useMemo, type ComponentType } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';

type Props = {
    ownerOrgUnit: string,
};
const ENROLLMENT_RETRIEVE_ERROR =
    'Enrollment widget could not be loaded. Please try again later';

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
        log.error(errorCreator(ENROLLMENT_RETRIEVE_ERROR)({ error }));
        return <span>{i18n.t(ENROLLMENT_RETRIEVE_ERROR)} </span>;
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
        <> </>
    );
};
