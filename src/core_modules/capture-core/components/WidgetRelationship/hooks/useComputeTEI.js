// @flow
import { useMemo } from 'react';

export const useComputeTEI = (from: Object, to: Object) => {
    const { attributes: fromAttributes, trackedEntityInstance: fromTeiId } = from.trackedEntityInstance;
    const { attributes: toAttributes, trackedEntityInstance: toTeiId } = to.trackedEntityInstance;
    const { headers, commonAttributes } = useMemo(() => fromAttributes
        .reduce((acc, currentAttr) => {
            const attributeId = currentAttr.attribute;
            const toAttr = toAttributes.find(item => item.attribute === attributeId);
            if (toAttr) {
                acc.commonAttributes[toTeiId] = { ...acc.commonAttributes[toTeiId] ?? [], [attributeId]: toAttr };
                acc.commonAttributes[fromTeiId] = {
                    ...acc.commonAttributes[fromTeiId] ?? [], [attributeId]: currentAttr,
                };
                acc.headers.push({ attributeId, displayName: currentAttr.displayName });
            }
            return acc;
        }, { commonAttributes: {}, headers: [] }), [fromAttributes, toAttributes, fromTeiId, toTeiId]);

    return { headers, commonAttributes };
};
