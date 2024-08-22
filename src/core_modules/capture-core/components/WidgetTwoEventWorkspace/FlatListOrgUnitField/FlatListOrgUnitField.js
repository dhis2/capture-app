// @flow
import React from 'react';
import { useOrgUnitName } from '../../../metadataRetrieval/orgUnitName';

type Props = {
    orgUnitId: string,
}

export const FlatListOrgUnitField = ({
    orgUnitId,
}: Props) => {
    const { displayName } = useOrgUnitName(orgUnitId);

    return (
        <span>
            {displayName}
        </span>
    );
};
