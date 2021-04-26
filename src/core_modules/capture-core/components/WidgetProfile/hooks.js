

import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getApi } from '../../d2/d2Instance';

export const useWidgetProfileData = () => {
    const { teiId, programId } =
      useSelector(({ router: { location: { query } } }) => ({ teiId: query.teiId, programId: query.programId }));

    const [result, setResult] = useState(null);

    const requestData = useCallback(() => {
        const programQuery = getApi()
            .get(
            // $FlowFixMe[incompatible-type] automated comment
                `programs/${programId}`,
                {
                    fields: ['programTrackedEntityAttributes[id,displayInList,trackedEntityAttribute[id,displayName]]'],
                },
            );
        const attributeQuery = getApi()
            .get(
            // $FlowFixMe[incompatible-type] automated comment
                `trackedEntityInstances/${teiId}`,
                {
                    program: programId,
                },
            );
        Promise.all([programQuery, attributeQuery]).then(([{ programTrackedEntityAttributes }, { attributes }]) => {
            const displayEntities = programTrackedEntityAttributes.reduce((acc, curr) => { acc = [...acc, curr.trackedEntityAttribute]; return acc; }, []);

            const formattedAttributes = [];
            displayEntities.forEach((entity) => {
                const displayAttribute = attributes.find(att => att.attribute === entity.id);
                if (displayAttribute) {
                    formattedAttributes.push({ ...entity, value: displayAttribute.value });
                }
            });
            setResult(formattedAttributes);
        });
    }, [programId, teiId]);

    useEffect(
        () => {
            if (result) {
                return;
            }
            requestData();
        },
        [result, requestData],
    );


    return result;
};
