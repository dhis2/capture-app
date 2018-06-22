// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import FileDownloadIcon from '@material-ui/icons/FileDownload';

import { getApi } from '../../d2/d2Instance';
import getProgramAndStageFromProgramId from '../../metaData/helpers/EventProgram/getProgramAndStageFromProgramId';

const styles = () => ({
    menuButtons: {
        textDecoration: 'none',
        outline: 'none',
    },
});

type Props = {
    classes: Object,
    selectedOrgUnitId: string,
    selectedProgramId: string,
};

type State = {
    anchorEl: any,
};

class DownloadTable extends Component<Props, State> {
    constructor() {
        super();
        // anchorEl is the button that spawns the menu.
        this.state = {
            anchorEl: null,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const { classes, selectedProgramId } = this.props;
        const baseUrl = getApi().baseUrl;

        const programAndStageContainer = getProgramAndStageFromProgramId(selectedProgramId);
        if (!programAndStageContainer.stage) {
            return null;
        }
        const selectedProgramStageId = programAndStageContainer.stage.id;

        return (
            <span>
                <IconButton
                    aria-owns={anchorEl ? 'download-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    variant="fab"
                    color="primary"
                >
                    <FileDownloadIcon />
                </IconButton>
                <Menu
                    id="download-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <a
                        className={classes.menuButtons}
                        href={
                            `${baseUrl}/events/query.json?orgUnit=${this.props.selectedOrgUnitId}&programStage=${selectedProgramStageId}&skipPaging=true`
                        }
                        download
                        tabIndex={-1}
                    >
                        <MenuItem onClick={this.handleClose}>JSON</MenuItem>
                    </a>
                    <a
                        className={classes.menuButtons}
                        href={
                            `${baseUrl}/events/query.xml?orgUnit=${this.props.selectedOrgUnitId}&programStage=${selectedProgramStageId}&skipPaging=true`
                        }
                        download
                        tabIndex={-1}
                    >
                        <MenuItem onClick={this.handleClose}>XML</MenuItem>
                    </a>
                    <a
                        className={classes.menuButtons}
                        href={
                            `${baseUrl}/events/query.csv?orgUnit=${this.props.selectedOrgUnitId}&programStage=${selectedProgramStageId}&skipPaging=true`
                        }
                        download
                        tabIndex={-1}
                    >
                        <MenuItem onClick={this.handleClose}>CSV</MenuItem>
                    </a>
                </Menu>
            </span>
        );
    }
}

export default withStyles(styles)(DownloadTable);
