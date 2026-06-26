import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, Chip, Popover, IconChevronDown16, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
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
    popoverContent: {
        width: 400,
    },
});

type OrgUnitValue = {
    id: string;
    name: string;
    path: string;
};

type CollapsedOrgUnitSelectFieldProps = {
    value?: OrgUnitValue;
    onBlur: (value: any) => void;
    disabled?: boolean;
};

type Props = CollapsedOrgUnitSelectFieldProps & WithStyles<typeof getStyles>;

type State = {
    open: boolean;
    previousOrgUnitId: string | null;
};

class CollapsedOrgUnitSelectFieldPlain extends React.Component<Props, State> {
    anchorRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.state = {
            open: false,
            previousOrgUnitId: null,
        };
        this.anchorRef = React.createRef() as React.RefObject<HTMLDivElement>;
    }

    onSelectOrgUnit = (orgUnit: Record<string, any>) => {
        this.props.onBlur({
            id: orgUnit.id,
            name: orgUnit.displayName,
            path: orgUnit.path,
        });
        this.setState({ open: false });
    }

    handleTreeBlur = () => {
        // no-op: selection commits via onSelectClick; avoid clearing the value on popover blur
    }

    onDeselectOrgUnit = () => {
        this.props.value && this.setState({ previousOrgUnitId: this.props.value.id });
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

    renderCollapsedSelector = () => {
        const { classes, disabled } = this.props;
        return (
            <React.Fragment>
                <div ref={this.anchorRef} data-test="collapsed-org-unit-selector">
                    <Button
                        small
                        disabled={disabled}
                        icon={<IconChevronDown16 />}
                        onClick={() => this.setState(prevState => ({ open: !prevState.open }))}
                    >
                        {i18n.t('Choose an organisation unit')}
                    </Button>
                </div>
                {this.state.open && (
                    <Popover
                        reference={this.anchorRef.current || undefined}
                        arrow={false}
                        placement="bottom-start"
                        onClickOutside={() => this.setState({ open: false })}
                        maxWidth={400}
                    >
                        <div className={classes.popoverContent}>
                            <OrgUnitField
                                onSelectClick={this.onSelectOrgUnit}
                                onBlur={this.handleTreeBlur}
                                previousOrgUnitId={this.state.previousOrgUnitId}
                                maxTreeHeight={350}
                                disabled={disabled}
                            />
                        </div>
                    </Popover>
                )}
            </React.Fragment>
        );
    }

    render() {
        const { value } = this.props;
        return value ? this.renderSelectedOrgUnit(value) : this.renderCollapsedSelector();
    }
}

export const CollapsedOrgUnitSelectField = withStyles(getStyles)(CollapsedOrgUnitSelectFieldPlain);
