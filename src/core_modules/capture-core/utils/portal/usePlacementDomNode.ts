import { useState, useEffect, useRef } from 'react';

// Main use case is to get the placement DOM Node when using portals.
// The hook ensures a rerender after a reference to the DOMNode has been acquired.
export const usePlacementDomNode = () => {
    const domRef = useRef<HTMLDivElement>(null);
    const [domNode, setDomNode] = useState<HTMLElement>();
    useEffect(() => {
        if (domRef.current) {
            setDomNode(domRef.current);
        }
    }, [setDomNode]);

    return {
        domRef,
        domNode,
    };
};
