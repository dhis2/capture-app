// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { IconCross24 } from '@dhis2/ui';
import { Button } from '../../Buttons';
import { OrgUnitField } from '../../FormFields/New';

const styles = (theme: Theme) => ({
    paper: {
        padding: 8,
        backgroundColor: theme.palette.grey.lighter,
    },
    title: {
        margin: 0,
        fontWeight: 425,
        fontSize: 15,
        paddingBottom: 5,
    },
    form: {
        width: '100%',
    },
    listItem: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginBottom: 5,
        padding: 5,
        border: '1px solid lightGrey',
    },
    selectedText: {
        marginTop: 5,
        marginBottom: 5,
        padding: 5,
        borderLeft: '2px solid #71a4f8',
    },
    selectedPaper: {
        backgroundColor: theme.palette.grey.lighter,
        padding: 8,
    },
    selectedButton: {
        width: 20,
        height: 20,
        padding: 0,
    },
    selectedItemContainer: {
        display: 'flex',
        alignItems: 'center',
        minHeight: 28,
        marginTop: 8,
        marginBottom: 4,
        paddingLeft: 5,
        borderLeft: `2px solid ${theme.palette.primary.light}`,
    },
    selectedItemClear: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

type Props = {
    handleClickOrgUnit: (orgUnitId: ?string, orgUnitObject: ?Object) => void,
    onReset: () => void,
    selectedOrgUnitId: string,
    showWarning: boolean,
    selectedOrgUnit: Object,
    classes: Object,
};

type State = {
    open: boolean,
};

class OrgUnitSelectorPlain extends Component<Props, State> {
    handleShowWarning: () => void;
    handleClose: () => void;
    handleClick: (orgUnit: Object) => void;
    handleReset: () => void;
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };

        this.handleShowWarning = this.handleShowWarning.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleShowWarning() {
        if (this.props.showWarning) {
            this.setState({ open: true });
        } else {
            this.handleReset();
        }
    }

    handleClose() {
        this.setState({ open: false });
    }

    handleClick(selectedOu) {
        const orgUnitObject = { id: selectedOu.id, name: selectedOu.displayName, code: selectedOu.code };
        this.props.handleClickOrgUnit(selectedOu.id, orgUnitObject);
    }

    handleReset() {
        this.props.handleClickOrgUnit(undefined, null);
    }

    render() {
        // If orgUnit is set in Redux state.
        const { selectedOrgUnit, selectedOrgUnitId } = this.props;
        if (selectedOrgUnitId && selectedOrgUnit) {
            return (
                <div data-test="org-unit-selector-container">
                    <Paper square elevation={0} className={this.props.classes.selectedPaper}>
                        <h4 className={this.props.classes.title}>{ i18n.t('Selected registering unit') }</h4>
                        <div className={this.props.classes.selectedItemContainer}>
                            <div>{selectedOrgUnit.name}</div>
                            <div className={this.props.classes.selectedItemClear}>
                                <IconButton
                                    data-test="reset-selection-button"
                                    className={this.props.classes.selectedButton}
                                    onClick={() => { this.props.onReset(); }}
                                >
                                    <IconCross24 />
                                </IconButton>
                            </div>
                        </div>
                    </Paper>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                    >
                        <DialogTitle>{i18n.t('Start Again')}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {i18n.t('Are you sure? All unsaved data will be lost.')}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={this.handleClose}
                                secondary
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                onClick={this.handleReset}
                                primary
                            >
                                {i18n.t('Accept')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }

        return (
            <div data-test="org-unit-selector-container">
                <Paper square elevation={0} className={this.props.classes.paper}>
                    <h4 className={this.props.classes.title}>{ i18n.t('Registering Organisation Unit') }</h4>
                    <div>
                        <OrgUnitField
                            data-test="org-unit-field"
                            onSelectClick={this.handleClick}
                        />
                    </div>
                </Paper>
            </div>
        );
    }
}

export const OrgUnitSelector = withStyles(styles)(OrgUnitSelectorPlain);
