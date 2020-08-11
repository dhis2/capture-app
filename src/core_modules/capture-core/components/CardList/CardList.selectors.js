// @flow
import { createSelector } from 'reselect';
import { elementTypes } from '../../metaData/DataElement';


const elementsSelector = dataElements => dataElements;

// $FlowFixMe[missing-annot] automated comment
const makeElementsContainerSelector = () => createSelector(
    elementsSelector,
    (elements) => {
        // $FlowFixMe[prop-missing] automated comment
        const imageDataElement = elements.find(a => a.type === elementTypes.IMAGE);
        if (imageDataElement) {
            const newElements = [...elements];
            newElements.splice(newElements.indexOf(imageDataElement), 1);
        }

        return {
            dataElementChunks: elements,
            imageDataElement,
        };
    });

export default makeElementsContainerSelector;
