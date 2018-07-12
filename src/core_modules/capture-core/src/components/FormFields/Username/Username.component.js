import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { getApi } from '../../../d2/d2Instance'


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
  const matches = match(user.userCredentials.username, query);
  const parts = parse(user.userCredentials.username, matches);

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
  return user.userCredentials.username;
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

  componentDidMount() {
    getApi().get('users?fields=name,id,userCredentials[username]')
      .then((response: any) => {
        console.log(response.users)
        this.setState({
          users: response.users
        })
      })
  }

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
        onSuggestionsFetchRequested={() => null}
        onSuggestionsClearRequested={() => null}
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
