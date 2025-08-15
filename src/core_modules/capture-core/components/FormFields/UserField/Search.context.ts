import { createContext } from 'react';

type SearchContextType = {
    inputName: string;
    suggestionName: string;
};

export const SearchContext = createContext<SearchContextType>({
    inputName: 'userfield_input',
    suggestionName: 'userfield_search_suggestion',
});
