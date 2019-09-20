// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import FileDownloadIcon from '@material-ui/icons/FileDownload';
import moment from '../../utils/moment/momentResolver';

import { getApi } from '../../d2/d2Instance';
import { ProgramStage, EventProgram } from '../../metaData';

const styles = () => ({
    menuButtonHref: {
        textDecoration: 'none',
        outline: 'none',
    },
    menuButton: {
        paddingLeft: 24,
        paddingRight: 24,
    },
});

type Props = {
    classes: Object,
    programAndStageContainer: { program: ?EventProgram, stage: ?ProgramStage },
    orgUnit: { id: string, name: string },
    selectedCategoryOptions: { [key: string]: string },
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

    getFileName = (program: EventProgram, orgUnit: { id: string, name: string }) => {
        const today = moment().format('YYYYMMDD');
        return `${orgUnit.name} - ${program.name} - ${today}`;
    }

    render() {
        const { anchorEl } = this.state;
        const { classes, programAndStageContainer, orgUnit, selectedCategoryOptions } = this.props;
        const { id: orgUnitId } = orgUnit;
        const baseUrl = getApi().baseUrl;

        // Generate Category filter for URL.
        let categoryFilter = '';
        if (programAndStageContainer.program && programAndStageContainer.program.categoryCombination && selectedCategoryOptions) {
            categoryFilter = `&attributeCc=${programAndStageContainer.program.categoryCombination.id}`;

            let selectedOptionsString = '';
            Object.keys(selectedCategoryOptions).forEach((key) => {
                selectedOptionsString += `${selectedCategoryOptions[key]};`;
            });

            categoryFilter += `&attributeCos=${selectedOptionsString}`;
        }

        if (!programAndStageContainer.stage) {
            return null;
        }
        const selectedProgramStageId = programAndStageContainer.stage.id;
        const fileName = this.getFileName(programAndStageContainer.program, orgUnit);

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
                        className={classes.menuButtonHref}
                        href={
                            `${baseUrl}/events/query.json?orgUnit=${orgUnitId}&programStage=${selectedProgramStageId}${categoryFilter}&skipPaging=true`
                        }
                        download={fileName}
                        tabIndex={-1}
                    >
                        <MenuItem className={classes.menuButton} onClick={this.handleClose}>JSON</MenuItem>
                    </a>
                    <a
                        className={classes.menuButtonHref}
                        href={
                            `${baseUrl}/events/query.xml?orgUnit=${orgUnitId}&programStage=${selectedProgramStageId}${categoryFilter}&skipPaging=true`
                        }
                        download={fileName}
                        tabIndex={-1}
                    >
                        <MenuItem className={classes.menuButton} onClick={this.handleClose}>XML</MenuItem>
                    </a>
                    <a
                        className={classes.menuButtonHref}
                        href={
                            `${baseUrl}/events/query.csv?orgUnit=${orgUnitId}&programStage=${selectedProgramStageId}${categoryFilter}&skipPaging=true`
                        }
                        download={fileName}
                        tabIndex={-1}
                    >
                        <MenuItem className={classes.menuButton} onClick={this.handleClose}>CSV</MenuItem>
                    </a>
                </Menu>
            </span>
        );
    }
}

export default withStyles(styles)(DownloadTable);
