// @flow
import { useMemo } from 'react';
import { type TEIData, type TEIRelationship } from '../../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

const getRelationshipAttributes = (bidirectional: boolean, teiId: string, from: TEIData, to: TEIData) => {
    const { attributes: fromAttributes, trackedEntityInstance: fromTeiId } = from.trackedEntityInstance;
    const { attributes: toAttributes, trackedEntityInstance: toTeiId } = to.trackedEntityInstance;

    if (!bidirectional) { return { id: toTeiId, attributes: toAttributes }; }

    return fromTeiId !== teiId
        ? { id: fromTeiId, attributes: fromAttributes }
        : { id: toTeiId, attributes: toAttributes };
};

export const useComputeTEIRelationships = (teiId: string, relationships?: ?{[key: string]: Array<TEIRelationship>}) => {
    const relationshipsByType = useMemo(() => relationships &&
    relationships[teiId].reduce((acc, currentRelationship) => {
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
    }, []), [teiId, relationships]);
    // this will change after https://jira.dhis2.org/browse/DHIS2-12249 is done
    const headersByType = useMemo(() => relationshipsByType &&
    relationshipsByType.reduce((acc, { id, relationshipAttributes }) => {
        acc[id] = relationshipAttributes.reduce((accAttr, { attributes }) => {
            accAttr.push(attributes.map(item => ({ id: item.attribute, label: item.displayName })));
            return accAttr;
        }, []).reduce((p, current) => p.filter(e => current.find(item => item.id === e.id)));

        return acc;
    }, {}), [relationshipsByType]);

    return { relationshipsByType: relationshipsByType ?? [], headersByType: headersByType ?? {} };
};
