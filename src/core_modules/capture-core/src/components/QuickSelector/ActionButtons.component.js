import React from 'react';
import { withStyles } from 'material-ui-next/styles';

import Button from 'material-ui-next/Button';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import SearchIcon from 'material-ui-icons/Search';

const styles = () => ({
    root: {
        flexGrow: 1,
        padding: 10,
        textAlign: 'right',
    },
    button: {
        marginRight: 5,
    },
});

function ActionButtons(props) {
    const { classes } = props;

    return (
        <div className={classes.root}>
            <Button raised color="primary"><AddIcon className={classes.button} /> New</Button>
            <Button raised color="primary"><SearchIcon className={classes.button} /> Find</Button>
        </div>
    );
}

export default withStyles(styles)(ActionButtons);
