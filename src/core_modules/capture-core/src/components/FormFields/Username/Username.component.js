import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const users = [
  { label: 'Markus' },
  { label: 'Hendrik' },
];

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function renderUser(user, { query, isHighlighted }) {
  const matches = match(user.label, query);
  const parts = parse(user.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderUsersContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getUserValue(user) {
  return user.label;
}

function getUsers(value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : users.filter(user => {
      const keep =
        count < 5 && user.label.toLowerCase().slice(0, inputLength) === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 250,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
});

class UsernameAutosuggest extends React.Component {
  state = {
    value: '',
    users: [],
  };

  handleUsersFetchRequested = ({ value }) => {
    this.setState({
      users: getUsers(value),
    });
  };

  handleUsersClearRequested = () => {
    this.setState({
      users: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.users}
        onSuggestionsFetchRequested={this.handleUsersFetchRequested}
        onSuggestionsClearRequested={this.handleUsersClearRequested}
        renderSuggestionsContainer={renderUsersContainer}
        getSuggestionValue={getUserValue}
        renderSuggestion={renderUser}
        inputProps={{
          classes,
          placeholder: 'search for username',
          value: this.state.value,
          onChange: this.handleChange,
        }}
      />
    );
  }
}

UsernameAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UsernameAutosuggest);
