// @flow
import { createContext } from 'react';

// $FlowFixMe[missing-annot] automated comment
const SearchContext = createContext({
    inputName: 'userfield_input',
    suggestionName: 'userfield_search_suggestion',
});

export default SearchContext;
