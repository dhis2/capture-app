// @flow
import { useMemo } from 'react';


const getRelationshipAttributes = (bidirectional: boolean, teiId: string, from: Object, to: Object) => {
    const { attributes: fromAttributes, trackedEntityInstance: fromTeiId } = from.trackedEntityInstance;
    const { attributes: toAttributes, trackedEntityInstance: toTeiId } = to.trackedEntityInstance;

    if (!bidirectional) { return { id: toTeiId, attributes: toAttributes }; }

    return fromTeiId !== teiId
        ? { id: fromTeiId, attributes: fromAttributes }
        : { id: toTeiId, attributes: toAttributes };
};

export const useComputeTEIRelationship = (teiId: string, teiRelationships: Array<Object>) => {
    const relationshipsByType = useMemo(() => teiRelationships && teiRelationships.reduce((acc, currentRelationship) => {
        const { relationshipType: typeId, relationshipName, bidirectional, from, to } = currentRelationship;
        const typeExist = acc.find(item => item.id === typeId);
        const relationshipAttributes = getRelationshipAttributes(bidirectional, teiId, from, to);

        if (typeExist) {
            typeExist.relationshipAttributes.push(relationshipAttributes);
        } else {
            acc.push({
                id: typeId,
                relationshipName,
                relationshipAttributes: [relationshipAttributes],
            });
        }
        return acc;
    }, []), [teiId, teiRelationships]);
    const headersByType = relationshipsByType.reduce((acc, { id, relationshipAttributes }) => {
        acc[id] = relationshipAttributes.reduce((accAttr, { attributes }) => {
            accAttr.push(attributes.map(item => ({ id: item.attribute, label: item.displayName })));
            return accAttr;
        }, []).reduce((p, current) => p.filter(e => current.find(item => item.id === e.id)));

        return acc;
    }, []);

    return { relationshipsByType, headersByType };
};
