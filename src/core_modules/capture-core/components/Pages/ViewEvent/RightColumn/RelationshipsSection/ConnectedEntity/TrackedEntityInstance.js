// @flow
import React, { useCallback } from 'react';
import { buildUrlQueryString } from '../../../../../../utils/routing';

type Props = {
    name: string,
    id: string,
    orgUnitId: string,
    linkProgramId?: ?string,
};

export const TrackedEntityInstance = ({ name, id, orgUnitId, linkProgramId }: Props) => {
    const getUrl = useCallback(
        () =>
            `/#/enrollment?${buildUrlQueryString({
                teiId: id,
                programId: linkProgramId,
                orgUnitId,
                enrollmentId: 'AUTO',
            })}`,
        [id, orgUnitId, linkProgramId],
    );

    return (
        <a href={getUrl()} target="_blank" rel="noopener noreferrer">
            {name}
        </a>
    );
};
