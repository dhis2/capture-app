import type { SearchGroup } from '../../../metaData';

export type Props = {
    id: string;
    searchGroupId: string;
    onSearch: (formId: string, searchGroupId: string) => void;
    onSearchValidationFailed: (formId: string, SearchGroupId: string) => void;
    searchAttempted: boolean;
    searchId: string;
    searchGroup: SearchGroup;
    attributesWithValuesCount: number;
    formsValues: { [formElement: string]: any };
    classes: {
        searchButtonContainer: string;
        orgUnitSection: string;
        minAttributesRequired: string;
        minAttribtuesRequiredInvalid: string;
    };
};
