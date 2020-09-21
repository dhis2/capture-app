// @flow
import { createSelector } from 'reselect';
import { chunk } from 'capture-core-utils';
import { dataElementTypes } from '../../metaData/DataElement';


const elementsSelector = props => props.dataElements;

// $FlowFixMe[missing-annot] automated comment
const makeElementsContainerSelector = () => createSelector(
    elementsSelector,
    (elements) => {
        const newElements = [...elements];
        const imageDataElement = elements.find(a => a.type === dataElementTypes.IMAGE);
        if (imageDataElement) {
            newElements.splice(newElements.indexOf(imageDataElement), 1);
        }
        return {
            dataElementChunks: chunk(elements, 5),
            imageDataElement,
        };
    });

export default makeElementsContainerSelector;
