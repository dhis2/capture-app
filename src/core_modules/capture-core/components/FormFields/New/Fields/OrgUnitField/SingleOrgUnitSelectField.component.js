// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import { Chip, colors } from '@dhis2/ui';
import { OrgUnitField } from './OrgUnitField.component';
import { TooltipOrgUnit } from '../../../../Tooltips/TooltipOrgUnit/TooltipOrgUnit.component';

const getStyles = () => ({
    selectedOrgUnitContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    chip: {
        cursor: 'text !important',
        '&:hover': {
            backgroundColor: `${colors.grey200} !important`,
        },
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
        chip: string,
    }
}

class SingleOrgUnitSelectFieldPlain extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            previousOrgUnitId: null,
        };
    }
    renderSelectedOrgUnit = (selectedOrgUnit: OrgUnitValue) => {
        const { classes } = this.props;
        return (
            <div className={classes.selectedOrgUnitContainer}>
                <Chip
                    onRemove={this.onDeselectOrgUnit}
                    className={classes.chip}
                >
                    <TooltipOrgUnit orgUnitId={selectedOrgUnit.id} />
                </Chip>
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
        this.props.value && this.setState({ previousOrgUnitId: this.props.value.id });
        this.props.onBlur(null);
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
