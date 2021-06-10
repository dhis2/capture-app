// @flow
import React from 'react';

export const transformTrackerNode = (node: Object, index: number, nodeToElementFn: (...args : Array<any>) => any) => {
    if (node.name === 'input') {
        const htmlElementId = node.attribs?.attributeid;

        if (htmlElementId) {
            const inputElement = nodeToElementFn(node, index);

            const style = inputElement.props?.style;
            const className = inputElement.props?.className;

            const customFormElementProps = {
                id: htmlElementId,
                style,
                className,
            };

            return React.createElement(
                'FormField', {
                    customFormElementProps,
                    id: htmlElementId,
                },
            );
        }
        return null;
    }
    return undefined;
};
