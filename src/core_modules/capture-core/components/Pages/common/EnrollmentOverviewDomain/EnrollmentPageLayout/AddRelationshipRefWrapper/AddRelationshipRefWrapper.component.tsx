import React, { useEffect, useRef } from 'react';

type Props = {
    setRelationshipRef: (element: HTMLDivElement) => void,
}

export const AddRelationshipRefWrapper = ({ setRelationshipRef }: Props) => {
    const renderRelationshipRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (renderRelationshipRef.current) {
            setRelationshipRef(renderRelationshipRef.current);
        }
    }, [setRelationshipRef]);

    return (
        <div ref={renderRelationshipRef} />
    );
};
