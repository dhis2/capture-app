// @flow
import { createSelector } from 'reselect';
import { dataElementTypes } from '../../metaData';


const elementsSelector = dataElements => dataElements;

// $FlowFixMe[missing-annot] automated comment
export const makeElementsContainerSelector = () => createSelector(
    elementsSelector,
    (elements) => {
        const imageDataElement = elements.find(a => a.type === dataElementTypes.IMAGE);
        if (imageDataElement) {
            const newElements = [...elements];
            newElements.splice(newElements.indexOf(imageDataElement), 1);
        }

        return {
            dataElements: elements,
            imageDataElement,
        };
    });

