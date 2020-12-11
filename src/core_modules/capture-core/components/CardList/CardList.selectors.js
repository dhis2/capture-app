// @flow
import { createSelector } from 'reselect';
import { dataElementTypes } from '../../metaData';

const elementsSelector = (dataElements) => dataElements;

export const makeElementsContainerSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(elementsSelector, (elements) => {
    const profileImageDataElement = elements.find((a) => a.type === dataElementTypes.IMAGE);
    const newElements = [...elements];
    if (profileImageDataElement) {
      newElements.splice(newElements.indexOf(profileImageDataElement), 1);
    }

    return {
      dataElementsExceptProfileImage: newElements,
      profileImageDataElement,
    };
  });
