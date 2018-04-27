// @flow
/* eslint-disable */
import React, { Component } from 'react';
import { withStyles } from 'material-ui-next/styles';

import { getApi } from '../../d2/d2Instance';
import Button from 'material-ui-next/Button';

const styles = () => ({
    button: {
        float: 'right',
    },
});

class DownloadTable extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        const orgUnit = 'DiszpKrYNg8';
        const programStage = 'dBwrot7S420';
        const skipPaging = true;
        getApi().get('events/query.json', {orgUnit, programStage, skipPaging}).then(response => console.log(response));
    }

    render() {
        return (
            <Button variant="raised" onClick={() => this.handleClick()}>
                Download
            </Button>
        );
    }
}

export default withStyles(styles)(DownloadTable);
