import type { SearchGroups } from '../SearchBox.types';
import { dataElementTypes, OptionSet } from '../../../metaData';

export type CurrentSearchTerms = Array<{
    name: string;
    value: any;
    id: string;
    type: typeof dataElementTypes[keyof typeof dataElementTypes];
    optionSet?: OptionSet | null;
}>;

export type FormsValues = {
    [formIdentifier: string]: {
        [formElement: string]: Record<string, unknown>;
    };
};

export type OwnProps = {
    searchGroupsForSelectedScope: SearchGroups;
    selectedSearchScopeId?: string;
};

export type PropsFromRedux = {
    keptFallbackSearchFormValues: FormsValues;
    formsValues: FormsValues;
    searchStatus: string;
    isSearchViaAttributesValid: (minAttributesRequiredToSearch: number, formId: string) => boolean;
    isSearchViaUniqueIdValid: (formId: string) => boolean;
};

export type DispatchersFromRedux = {
    searchViaUniqueIdOnScopeProgram: ({ programId, formId }: { programId: string; formId: string }) => void;
    searchViaUniqueIdOnScopeTrackedEntityType: ({ 
        trackedEntityTypeId, formId 
    }: { 
        trackedEntityTypeId: string; formId: string 
    }) => void;
    searchViaAttributesOnScopeProgram: ({ 
        programId, formId, resultsPageSize 
    }: { 
        programId: string; formId: string; resultsPageSize: number 
    }) => void;
    searchViaAttributesOnScopeTrackedEntityType: ({ 
        trackedEntityTypeId, formId, resultsPageSize 
    }: { 
        trackedEntityTypeId: string; formId: string; resultsPageSize: number 
    }) => void;
    saveCurrentFormData: ({ 
        searchScopeType, searchScopeId, formId, formsValues, searchGroupsForSelectedScope 
    }: { 
        searchScopeType: string; 
        searchScopeId: string; 
        formId: string; 
        formsValues: FormsValues; 
        searchGroupsForSelectedScope: SearchGroups 
    }) => void;
    removeFormDataFromReduxStore: () => void;
    addFormIdToReduxStore: (formId: string, keptFallbackSearchFormValues: FormsValues) => void;
    showUniqueSearchValueEmptyModal: ({ uniqueTEAName }: { uniqueTEAName: string }) => void;
};

export type Props = OwnProps & DispatchersFromRedux & PropsFromRedux;
