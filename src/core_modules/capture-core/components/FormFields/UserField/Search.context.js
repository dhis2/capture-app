// @flow
import { createContext } from 'react';

const SearchContext = createContext({
    inputName: 'userfield_input',
    suggestionName: 'userfield_search_suggestion',
});

export default SearchContext;
