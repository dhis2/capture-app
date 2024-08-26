// @flow
import React from 'react';
import { useOrgUnitNameWithAncestors } from '../../../metadataRetrieval/orgUnitName';

type Props = {
    orgUnitId: string,
}

export const FlatListOrgUnitField = ({
    orgUnitId,
}: Props) => {
    const { displayName } = useOrgUnitNameWithAncestors(orgUnitId);

    return (
        <span>
            {displayName}
        </span>
    );
};
