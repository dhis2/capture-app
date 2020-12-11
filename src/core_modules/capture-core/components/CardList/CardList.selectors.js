// @flow
import { createSelector } from 'reselect';
import { chunk } from 'capture-core-utils';
import { elementTypes } from '../../metaData/DataElement';

const elementsSelector = (props) => props.dataElements;

const makeElementsContainerSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(elementsSelector, (elements) => {
    const newElements = [...elements];
    // $FlowFixMe[prop-missing] automated comment
    const imageDataElement = elements.find((a) => a.type === elementTypes.IMAGE);
    if (imageDataElement) {
      newElements.splice(newElements.indexOf(imageDataElement), 1);
    }
    return {
      dataElementChunks: chunk(elements, 5),
      imageDataElement,
    };
  });

export default makeElementsContainerSelector;
