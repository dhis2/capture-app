// @flow
import * as React from 'react';
import { withStyles, IconButton } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import OrgUnitField from './OrgUnitField.component';


const getStyles = (theme: Theme) => ({
    selectedOrgUnitContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    clearSelectedOrgUnitButton: {
        height: theme.typography.pxToRem(44),
        width: theme.typography.pxToRem(44),
        marginLeft: theme.typography.pxToRem(10),
    },
    clearSelectedOrgUnitIcon: {
        height: theme.typography.pxToRem(20),
        width: theme.typography.pxToRem(20),
    },
    selectedOrgUnitText: {
        marginRight: theme.typography.pxToRem(20),
    },
});

type OrgUnitValue = {
    id: string,
    displayName: string,
    path: string,
}

type Props = {
    value?: ?OrgUnitValue,
    onBlur: (value: any) => void,
    classes: {
        selectedOrgUnitContainer: string,
        clearSelectedOrgUnitButton: string,
        clearSelectedOrgUnitIcon: string,
        selectedOrgUnitText: string,
    }
}

class SingleOrgUnitSelectField extends React.Component<Props> {
    renderSelectedOrgUnit = (selectedOrgUnit: OrgUnitValue) => {
        const { classes } = this.props;
        return (
            <div className={classes.selectedOrgUnitContainer}>
                <div className={classes.selectedOrgUnitText}>{selectedOrgUnit.displayName}</div>
                <IconButton
                    className={classes.clearSelectedOrgUnitButton}
                    onClick={this.onDeselectOrgUnit}
                >
                    <ClearIcon className={classes.clearSelectedOrgUnitIcon} />
                </IconButton>
            </div>
        );
    }

    onSelectOrgUnit = (event: any, orgUnit: Object) => {
        this.props.onBlur({
            id: orgUnit.id,
            displayName: orgUnit.displayName,
            path: orgUnit.path,
        });
    }

    onDeselectOrgUnit = () => {
        this.props.onBlur(null);
    }

    renderOrgUnitField = () => {
        const { classes, ...passOnProps } = this.props;
        return (
            <OrgUnitField
                onSelectClick={this.onSelectOrgUnit}
                {...passOnProps}
            />
        );
    }

    render() {
        const { value } = this.props;
        return value ? this.renderSelectedOrgUnit(value) : this.renderOrgUnitField();
    }
}

export default withStyles(getStyles)(SingleOrgUnitSelectField);
