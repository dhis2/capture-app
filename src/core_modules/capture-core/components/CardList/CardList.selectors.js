// @flow
import { createSelector } from 'reselect';
import { elementTypes } from '../../metaData/DataElement';


const elementsSelector = dataElements => dataElements;

// $FlowFixMe[missing-annot] automated comment
export const makeElementsContainerSelector = () => createSelector(
    elementsSelector,
    (elements) => {
        // $FlowFixMe[prop-missing] automated comment
        const profileImageDataElement = elements.find(a => a.type === elementTypes.IMAGE);
        const newElements = [...elements];
        if (profileImageDataElement) {
            newElements.splice(newElements.indexOf(profileImageDataElement), 1);
        }

        return {
            dataElementsExceptProfileImage: newElements,
            profileImageDataElement,
        };
    });

