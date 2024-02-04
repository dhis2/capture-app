// @flow
import React, { useEffect, useRef } from 'react';

type Props = {
    setRelationshipRef: (HTMLDivElement) => void,
}

export const AddRelationshipRefWrapper = ({ setRelationshipRef }: Props) => {
    const renderRelationshipRef = useRef<?HTMLDivElement>(undefined);

    // Extracting the logic to separate component because of the OrgUnitFetcher
    useEffect(() => {
        if (renderRelationshipRef.current) {
            setRelationshipRef(renderRelationshipRef.current);
        }
    }, [setRelationshipRef]);

    return (
        <div ref={renderRelationshipRef} />
    );
};
