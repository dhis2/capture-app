import React, { type ReactElement } from 'react';

export const transformTrackerNode = (
    node: any,
    index: number,
    nodeToElementFn: (node: any, index: number) => ReactElement<'FormField'>,
) => {
    if (node.name === 'input') {
        const htmlElementId = node.attribs?.attributeid;

        if (htmlElementId) {
            const inputElement = nodeToElementFn(node, index);

            const style = (inputElement as any).props?.style;
            const className = (inputElement as any).props?.className;

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
    nodeToElementFn: (node: any, index: number) => ReactElement<'FormField'>,
) => {
    if (node.name === 'input') {
        const htmlElementId = node.attribs && node.attribs.id;
        const findAttributeID = /-[^-]+/;
        const matchResult = htmlElementId && findAttributeID.exec(htmlElementId);
        if (matchResult) {
            const id = matchResult[0].replace('-', '');
            const inputElement = nodeToElementFn(node, index);

            const style = (inputElement as any).props?.style;
            const className = (inputElement as any).props?.className;

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
