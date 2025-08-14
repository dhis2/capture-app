import React, { type ReactElement } from 'react';

export const transformTrackerNode = (
    node: any,
    index: number,
    nodeToElementFn: (nodeParam: any, indexParam: number) => ReactElement<'FormField'>,
) => {
    if (node.name === 'input') {
        const htmlElementId = node.attribs?.attributeid;

        if (htmlElementId) {
            const inputElement: any = nodeToElementFn(node, index);

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
    }
    return undefined;
};

export const transformEventNode = (
    node: any,
    index: number,
    nodeToElementFn: (nodeParam: any, indexParam: number) => ReactElement<'FormField'>,
) => {
    if (node.name === 'input') {
        const htmlElementId = node.attribs && node.attribs.id;
        const findAttributeID = /-[^-]+/;
        const matchResult = htmlElementId && findAttributeID.exec(htmlElementId);
        if (matchResult) {
            const id = matchResult[0].replace('-', '');
            const inputElement: any = nodeToElementFn(node, index);

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
                    id,
                },
            );
        }
    }
    return undefined;
};
