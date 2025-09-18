import * as React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
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
    id: string;
    name: string;
    path: string;
};

type SingleOrgUnitSelectFieldState = {
    previousOrgUnitId: any;
};

type SingleOrgUnitSelectFieldProps = {
    value?: OrgUnitValue;
    onBlur: (value: any) => void;
    disabled?: boolean;
};

type Props = SingleOrgUnitSelectFieldProps & WithStyles<typeof getStyles>;

class SingleOrgUnitSelectFieldPlain extends React.Component<Props, SingleOrgUnitSelectFieldState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            previousOrgUnitId: null,
        };
    }

    onSelectOrgUnit = (orgUnit: Record<string, any>) => {
        this.props.onBlur({
            id: orgUnit.id,
            name: orgUnit.displayName,
            path: orgUnit.path,
        });
    }

    onDeselectOrgUnit = () => {
        this.props.value && 
            this.setState({ previousOrgUnitId: { id: this.props.value.id } });
        this.props.onBlur(null);
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

    renderOrgUnitField = () => {
        const { classes, ...passOnProps } = this.props;
        return (
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
