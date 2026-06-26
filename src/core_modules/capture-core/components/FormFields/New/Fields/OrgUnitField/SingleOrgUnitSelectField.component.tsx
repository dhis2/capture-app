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

type SingleOrgUnitSelectFieldState = {
    previousOrgUnitId: string | null;
    open: boolean;
};

type SingleOrgUnitSelectFieldProps = {
    value?: OrgUnitValue;
    onBlur: (value: any) => void;
    onSelectClick?: (orgUnit: Record<string, any>) => void;
    disabled?: boolean;
    maxTreeHeight?: number;
    collapsed?: boolean;
};

type Props = SingleOrgUnitSelectFieldProps & WithStyles<typeof getStyles>;

class SingleOrgUnitSelectFieldPlain extends React.Component<Props, SingleOrgUnitSelectFieldState> {
    anchorRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.state = {
            previousOrgUnitId: null,
            open: false,
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

    onDeselectOrgUnit = () => {
        this.props.value && this.setState({ previousOrgUnitId: this.props.value.id });
        this.props.onBlur(null);
    }

    handleCollapsedSelect = (orgUnit: Record<string, any>) => {
        if (this.props.onSelectClick) {
            this.props.onSelectClick(orgUnit);
        } else {
            this.onSelectOrgUnit(orgUnit);
        }
        this.setState({ open: false });
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

    renderInlineOrgUnitField = () => {
        const { classes, collapsed, ...passOnProps } = this.props;
        return (
            <OrgUnitField
                onSelectClick={this.onSelectOrgUnit}
                previousOrgUnitId={this.state.previousOrgUnitId}
                {...passOnProps}
            />
        );
    }

    renderCollapsedOrgUnitField = () => {
        const { classes, collapsed, value, onBlur, onSelectClick, disabled, maxTreeHeight, ...passOnProps } = this.props;
        return (
            <React.Fragment>
                <div ref={this.anchorRef} data-test="org-unit-selector-trigger">
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
                                {...passOnProps}
                                disabled={disabled}
                                maxTreeHeight={maxTreeHeight ?? 350}
                                onSelectClick={this.handleCollapsedSelect}
                                onBlur={() => undefined}
                                previousOrgUnitId={this.state.previousOrgUnitId}
                            />
                        </div>
                    </Popover>
                )}
            </React.Fragment>
        );
    }

    render() {
        const { value, collapsed } = this.props;
        if (value) {
            return this.renderSelectedOrgUnit(value);
        }
        return collapsed ? this.renderCollapsedOrgUnitField() : this.renderInlineOrgUnitField();
    }
}
export const SingleOrgUnitSelectField = withStyles(getStyles)(SingleOrgUnitSelectFieldPlain);
