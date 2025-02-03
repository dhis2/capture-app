// @flow
import { useState, useEffect, useRef } from 'react';

// Main use case is to get the placement DOM Node when using portals.
// The hook ensures a rerender after a reference to the DOMNode has been acquired.
export const usePlacementDomNode = () => {
    const domRef = useRef<?HTMLElement>();
    const [domNode, setDomNode] = useState();
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
