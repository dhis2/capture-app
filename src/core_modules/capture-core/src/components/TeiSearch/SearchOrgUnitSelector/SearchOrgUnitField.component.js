// @flow

import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import ClearIcon from '@material-ui/icons/Clear';
import { OrgUnitField } from '../../FormFields/New';

type Props = {
    selectedOrgUnit: ?Object,
    onSetOrgUnit: (orgUnit: ?Object) => void,
    classes: {
        selectedOrgUnitContainer: string,
        clearSelectedOrgUnitButton: string,
        clearSelectedOrgUnitIcon: string,
        selectedOrgUnitText: string,
    }
}

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

class SearchOrgUnitField extends React.Component<Props> {
    renderSelectedOrgUnit = (selectedOrgUnit: Object) => {
        const { classes } = this.props;
        return (
            <div className={classes.selectedOrgUnitContainer}>
                <div className={classes.selectedOrgUnitText}>{selectedOrgUnit.displayName}</div>
                <IconButton
                    className={classes.clearSelectedOrgUnitButton}
                    onClick={() => { this.props.onSetOrgUnit(null); }}
                >
                    <ClearIcon className={classes.clearSelectedOrgUnitIcon} />
                </IconButton>
            </div>
        );
    }

    onSelectOrgUnit = (event: any, orgUnit: Object) => {
        this.props.onSetOrgUnit({
            id: orgUnit.id,
            displayName: orgUnit.displayName,
            path: orgUnit.path,
        });
    }
    renderOrgUnitField = () => {
        const { selectedOrgUnit, onSetOrgUnit, classes, ...passOnProps } = this.props;
        return (
            <OrgUnitField
                onSelectClick={this.onSelectOrgUnit}
                {...passOnProps}
            />
        );
    }

    render() {
        const { selectedOrgUnit } = this.props;
        return selectedOrgUnit ? this.renderSelectedOrgUnit(selectedOrgUnit) : this.renderOrgUnitField();
    }
}
export default withStyles(getStyles)(SearchOrgUnitField);
