
// @flow

import React from 'react';
import Autosuggest from 'react-autosuggest';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { DebounceField, TextField } from 'capture-ui';
import { makeCancelablePromise } from 'capture-core-utils';
import { getApi } from '../../../d2/d2Instance';
import type { User } from './types';

const styles = (theme: Theme) => ({
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1000,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
        maxHeight: 250,
        overflow: 'hidden',
    },
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.primary.light}`,
        borderRadius: '5px',
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
});

type Props = {
    onSet: (user: User) => void,
    classes: Object,
};

type State = {
    value: string,
    suggestions: Array<User>,
    suggestionsError?: ?string,
};

class UserSearch extends React.Component<Props, State> {
    static match(text, query) {
        const lcText = text.toLocaleLowerCase();
        const lcQUery = query.toLocaleLowerCase();
        const index = lcText.indexOf(lcQUery);
        if (index <= -1) {
            return [];
        }

        return [
            [
                index,
                index + query.length,
            ],
        ];
    }

    static renderSuggestion(user, { query, isHighlighted }) {
        const userText = `${user.name} (${user.username})`;
        const matches = UserSearch.match(userText, query);
        const parts = parse(userText, matches);

        return (
            <MenuItem
                selected={isHighlighted}
                component="div"
                className="Username__listitem" // purpose: Prevent onBlur effects when the item is selected
            >
                <div>
                    {parts.map((part, index) => (part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 500 }}>
                            {part.text}
                        </span>
                    ) : (
                        <strong key={String(index)} style={{ fontWeight: 300 }}>
                            {part.text}
                        </strong>
                    )))}
                </div>
            </MenuItem>
        );
    }

    static renderSuggestionContainer(options) {
        const { containerProps, children } = options;

        return (
            <Paper {...containerProps} square>
                {children}
            </Paper>
        );
    }

    static getSearchQueryParams(value: string) {
        return {
            fields: 'displayName,id,userCredentials[username]',
            paging: true,
            pageSize: 10,
            page: 1,
            query: value,
            totalPages: false,
        };
    }

    static getSuggestionValue(user) {
        return user;
    }

    cancelablePromise: ?{cancel: () => void, promise: Promise<any>};
    constructor(props: Props) {
        super(props);

        this.state = {
            value: '',
            suggestions: [],
        };
    }

    componentWillUnmount() {
        this.cancelablePromise && this.cancelablePromise.cancel();
    }

    setSuggestions(suggestions) {
        this.setState({
            suggestions,
        });
    }

    resetSuggestions() {
        this.setState({
            suggestions: [],
        });
    }

    setSuggestionsError(message: string) {
        this.setState({
            suggestionsError: message,
        });
    }

    handleInputChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        });

        this.cancelablePromise && this.cancelablePromise.cancel();

        if (newValue.length > 1) {
            const searchPromise = this.search(newValue);
            const cancelablePromise = makeCancelablePromise(searchPromise);
            this.cancelablePromise = cancelablePromise;
            cancelablePromise
                .promise
                .then((suggestions) => {
                    this.setSuggestions(suggestions);
                })
                .catch((error) => {
                    if (!error || !error.isCanceled) {
                        this.setSuggestionsError(i18n.t('suggestions could not be retrieved'));
                    }
                });
        } else {
            this.resetSuggestions();
        }
    };

    onSuggestionSelected = (event, { suggestionValue }) => {
        // this.props.onSet(suggestionValue);
    };

    onBlur = (event) => {
        if (event.relatedTarget && event.relatedTarget.className !== 'Username__listitem') {
            return;
        }
    }

    search = (value: string) => getApi()
        .get('users', UserSearch.getSearchQueryParams(value))
        .then((response) => {
            const apiUsers = (response && response.users) || [];
            return apiUsers
                .map(au => ({
                    id: au.id,
                    username: au.userCredentials.username,
                    name: au.displayName,
                }));
        });

    renderInput = (inputProps) => {
        const { onChange, ref, ...passOnInputProps } = inputProps;
        const classes = this.props.classes;
        return (
            <TextField
                {...passOnInputProps}
                onChange={(event) => { onChange(event, { newValue: event.currentTarget.value }); }}
                inputRef={ref}
                classes={classes}
                onSetFocus={this.props.onSetFocus}
                onRemoveFocus={this.props.onRemoveFocus}
            />
        );
    }

    render() {
        const { classes } = this.props;
        const { value, suggestions } = this.state;
        const inputProps = {
            value,
            suggestions,
            placeholder: i18n.t('search for username'),
            onChange: this.handleInputChange,
        };

        return (
            <div>
                <Autosuggest
                    theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                    renderInputComponent={this.renderInput}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={() => null}
                    onSuggestionsClearRequested={() => null}
                    onSuggestionSelected={this.onSuggestionSelected}
                    renderSuggestionsContainer={UserSearch.renderSuggestionContainer}
                    getSuggestionValue={UserSearch.getSuggestionValue}
                    renderSuggestion={UserSearch.renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        );
    }
}

export default withStyles(styles)(UserSearch);
