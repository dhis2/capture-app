// @flow
/* eslint-disable */
import React, { Component } from 'react';
import { withStyles } from 'material-ui-next/styles';

import { getApi } from '../../d2/d2Instance';
import Button from 'material-ui-next/Button';
import Menu, { MenuItem } from 'material-ui-next/Menu';

const styles = () => ({
    button: {
        float: 'right',
    },
});

class DownloadTable extends Component {
    constructor() {
        super();
        // anchorEl is the button that spawns the menu.
        this.state = { anchorEl: null, };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSelectFormat = this.handleSelectFormat.bind(this);
    }
    
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
      };
    
      handleClose = () => {
        this.setState({ anchorEl: null });
      };

    handleSelectFormat(format) {
        const orgUnit = 'DiszpKrYNg8';
        const programStage = 'dBwrot7S420';
        const skipPaging = true;

        getApi().get('events.' + format, {orgUnit, programStage, skipPaging}).then(response => console.log(response));
        this.handleClose();
    }

    render() {
        const { anchorEl } = this.state;

        return (
            <div>
                <Button 
                    aria-owns={anchorEl ? 'download-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    variant="raised"
                    color="primary"
                >
                    Download
                </Button>
                <Menu
                    id="download-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={() => this.handleSelectFormat('json')}>JSON</MenuItem>
                    <MenuItem onClick={() => this.handleSelectFormat('xml')}>XML</MenuItem>
                    <MenuItem onClick={() => this.handleSelectFormat('csv')}>CSV</MenuItem>
                </Menu>
                <h1>{this.props.selectedOrgUnit.id}</h1>
            </div>
        );
    }
}

export default withStyles(styles)(DownloadTable);
