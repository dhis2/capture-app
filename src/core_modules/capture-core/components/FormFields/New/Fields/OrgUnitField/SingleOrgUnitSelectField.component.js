// @flow
import * as React from 'react';
import classNames from 'classnames';
import { withStyles, IconButton } from '@material-ui/core';
import { IconCross24 } from '@dhis2/ui';
import { OrgUnitField } from './OrgUnitField.component';

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
    selectedOrgUnitText: {
        marginRight: theme.typography.pxToRem(20),
    },
});

type OrgUnitValue = {
    id: string,
    name: string,
    path: string,
}

type State = {
    previousOrgUnitId: Object
}

type Props = {
    value?: ?OrgUnitValue,
    onBlur: (value: any) => void,
    disabled?: ?boolean,
    classes: {
        selectedOrgUnitContainer: string,
        clearSelectedOrgUnitButton: string,
        clearSelectedOrgUnitButtonDisabled: string,
        selectedOrgUnitText: string,
    }
}

class SingleOrgUnitSelectFieldPlain extends React.Component<Props, State> {
    renderSelectedOrgUnit = (selectedOrgUnit: OrgUnitValue) => {
        const { classes, disabled } = this.props;
        const buttonClass = classNames(classes.clearSelectedOrgUnitButton, {
            [classes.clearSelectedOrgUnitButtonDisabled]: disabled,
        });
        return (
            <div className={classes.selectedOrgUnitContainer}>
                <div className={classes.selectedOrgUnitText}>{selectedOrgUnit.name}</div>
                <IconButton
                    className={buttonClass}
                    onClick={this.onDeselectOrgUnit}
                >
                    <IconCross24 />
                </IconButton>
            </div>
        );
    }

    onSelectOrgUnit = (orgUnit: Object) => {
        this.props.onBlur({
            id: orgUnit.id,
            name: orgUnit.displayName,
            path: orgUnit.path,
        });
    }

    onDeselectOrgUnit = () => {
        const { value: previousOrgUnitId } = this.props;
        this.props.onBlur(null);
        this.setState({ previousOrgUnitId });
    }

    renderOrgUnitField = () => {
        const { classes, ...passOnProps } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <OrgUnitField
                onSelectClick={this.onSelectOrgUnit}
                previousOrgUnitId={this.state.previousOrgUnitId}
                {...passOnProps}
            />
        );
    }

    render() {
        const { value } = this.props;
        return value ? this.renderSelectedOrgUnit(value) : this.renderOrgUnitField();
    }
}
export const SingleOrgUnitSelectField = withStyles(getStyles)(SingleOrgUnitSelectFieldPlain);
