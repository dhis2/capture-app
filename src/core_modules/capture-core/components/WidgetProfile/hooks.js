
import { useSelector } from 'react-redux';
import { makeCancelablePromise } from 'capture-core-utils';
import { getApi } from '../../d2/d2Instance';
import React, { useState, useEffect } from 'react';

export const useWidgetProfileData = () => {
    const { teiId, programId }: Object =
      useSelector(({ router: { location: { query } } }) => ({ teiId: query.teiId, programId: query.programId }));

    const [result, setResult] = useState(null);
    useEffect(
        () => {
            if (result) {
                return;
            }
            requestData().then(setResult);
        },
        [result],
    );


    const requestData = () => new Promise((resolve) => {
        const cancelablePromise = makeCancelablePromise(
            getApi()
                .get(
                // $FlowFixMe[incompatible-type] automated comment
                    `programs/${programId}`,
                    {
                        fields: ['programTrackedEntityAttributes[id,displayInList,trackedEntityAttribute[id,displayName]]'],
                    },
                ),
        );

        cancelablePromise.promise.then(
            ({ programTrackedEntityAttributes }) => {
                const displayEntities = programTrackedEntityAttributes.reduce((acc, curr) => { acc = [...acc, curr.trackedEntityAttribute]; return acc; }, []);

                getApi()
                    .get(
                        // $FlowFixMe[incompatible-type] automated comment
                        `trackedEntityInstances/${teiId}`,
                        {
                            program: programId,
                        },
                    ).then(({ attributes }) => {
                        const formattedAttributes = [];
                        displayEntities.forEach((entity) => {
                            const displayAttribute = attributes.find(att => att.attribute === entity.id);
                            if (displayAttribute) {
                                formattedAttributes.push({ ...entity, value: displayAttribute.value });
                            }
                        });
                        resolve(formattedAttributes);
                    });
            },
        );
    });
    return result;
};
