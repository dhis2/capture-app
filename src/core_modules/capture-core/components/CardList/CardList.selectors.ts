import { createSelector } from 'reselect';
import { dataElementTypes, type DataElement } from '../../metaData';


const elementsSelector = (dataElements: DataElement[]) => dataElements;

export const makeElementsContainerSelector = () => createSelector(
    elementsSelector,
    (elements: DataElement[]): {
        dataElementsExceptProfileImage: DataElement[];
        profileImageDataElement: DataElement | undefined;
    } => {
        const profileImageDataElement: DataElement | undefined = elements.find(a => a.type === dataElementTypes.IMAGE);
        const newElements: DataElement[] = [...elements];
        if (profileImageDataElement) {
            newElements.splice(newElements.indexOf(profileImageDataElement), 1);
        }

        return {
            dataElementsExceptProfileImage: newElements,
            profileImageDataElement,
        };
    });

