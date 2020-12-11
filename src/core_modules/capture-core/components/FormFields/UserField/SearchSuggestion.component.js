// @flow
import * as React from 'react';
import parse from 'autosuggest-highlight/parse';
import MenuItem from '@material-ui/core/MenuItem';
import classNames from 'classnames';
import SearchContext from './Search.context';
import defaultClasses from './searchSuggestion.module.css';
import type { User } from './types';

type Props = {
  user: User,
  query: string,
  isHighlighted: boolean,
  onHighlightNext: (user: User) => void,
  onHighlightPrev: (user: User) => void,
  onSelect: (user: User) => void,
  onExitSearch: (use: User) => void,
  suggestionRef: (ref: ?HTMLElement, user: User) => void,
  useUpwardList?: ?boolean,
};

function match(text, query) {
  const lcText = text.toLocaleLowerCase();
  const lcQUery = query.toLocaleLowerCase();
  const index = lcText.indexOf(lcQUery);
  if (index <= -1) {
    return [];
  }

  return [[index, index + query.length]];
}

function isInternalTarget(target, suggestionName, inputName) {
  if (target.getAttribute('name') === suggestionName || target.getAttribute('name') === inputName) {
    return true;
  }

  const { parentElement } = target;
  if (!parentElement) {
    return false;
  }

  return parentElement.getAttribute('name') === suggestionName;
}

const SearchSuggestion = (props: Props) => {
  const {
    user,
    query,
    isHighlighted,
    onHighlightNext,
    onHighlightPrev,
    suggestionRef,
    onSelect,
    onExitSearch,
    useUpwardList,
  } = props;

  const { inputName, suggestionName } = React.useContext(SearchContext);

  const userText = `${user.name} (${user.username})`;
  const matches = match(userText, query);
  const parts = parse(userText, matches);

  // eslint-disable-next-line complexity
  const handleKeyDown = React.useCallback(
    (event) => {
      if ((event.keyCode === 40 && !useUpwardList) || (event.keyCode === 38 && useUpwardList)) {
        onHighlightNext(user);
      } else if (
        (event.keyCode === 38 && !useUpwardList) ||
        (event.keyCode === 40 && useUpwardList)
      ) {
        onHighlightPrev(user);
      } else if (event.keyCode === 13) {
        onSelect(user);
      }
      event.stopPropagation();
      event.preventDefault();
    },
    [onHighlightNext, onHighlightPrev, onSelect, user, useUpwardList],
  );

  const handleRef = React.useCallback(
    (ref) => {
      suggestionRef(ref, user);
    },
    [suggestionRef, user],
  );

  const handleClick = React.useCallback(
    (event) => {
      onSelect(user);
      event.stopPropagation();
    },
    [onSelect, user],
  );

  const handleBlur = React.useCallback(
    (event) => {
      if (
        !event.relatedTarget ||
        !isInternalTarget(event.relatedTarget, suggestionName, inputName)
      ) {
        // $FlowFixMe[incompatible-call] automated comment
        onExitSearch();
      }
    },
    [onExitSearch, suggestionName, inputName],
  );

  return (
    <div
      name={suggestionName}
      role="button"
      tabIndex={-1}
      ref={handleRef}
      className={
        useUpwardList
          ? classNames(defaultClasses.suggestion, defaultClasses.suggestionInUpList)
          : defaultClasses.suggestion
      }
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onBlur={handleBlur}
    >
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) =>
            part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            ),
          )}
        </div>
      </MenuItem>
    </div>
  );
};

export default SearchSuggestion;
