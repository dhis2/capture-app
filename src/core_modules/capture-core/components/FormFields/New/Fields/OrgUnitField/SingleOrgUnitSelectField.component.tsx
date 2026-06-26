import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Chip, Popover, colors } from '@dhis2/ui';
import { DebounceField } from 'capture-ui';
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
    searchText: string;
};

type SingleOrgUnitSelectFieldProps = {
    value?: OrgUnitValue;
    onBlur: (value: any) => void;
    onSelectClick?: (orgUnit: Record<string, any>) => void;
    disabled?: boolean;
    maxTreeHeight?: number;
};

type Props = SingleOrgUnitSelectFieldProps & WithStyles<typeof getStyles>;

class SingleOrgUnitSelectFieldPlain extends React.Component<Props, SingleOrgUnitSelectFieldState> {
    anchorRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.state = {
            previousOrgUnitId: null,
            open: false,
            searchText: '',
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
        this.props.value && this.setState({ previousOrgUnitId: this.props.value.id, searchText: '' });
        this.props.onBlur(null);
    }

    handleSearchChange = (searchText: string) => {
        this.setState({ searchText, open: true });
    }

    handleCollapsedSelect = (orgUnit: Record<string, any>) => {
        if (this.props.onSelectClick) {
            this.props.onSelectClick(orgUnit);
        } else {
            this.onSelectOrgUnit(orgUnit);
        }
        this.setState({ open: false, searchText: '' });
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

    renderCollapsedOrgUnitField = () => {
        const { classes, value, onBlur, onSelectClick, disabled, maxTreeHeight, ...passOnProps } = this.props;
        return (
            <React.Fragment>
                <div
                    ref={this.anchorRef}
                    data-test="org-unit-selector-trigger"
                    onFocus={() => this.setState({ open: true })}
                >
                    <DebounceField
                        value={this.state.searchText}
                        onDebounced={(event: any) => this.handleSearchChange(event.currentTarget.value)}
                        placeholder={i18n.t('Search for an organisation unit')}
                        disabled={disabled}
                    />
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
                                hideSearchField
                                searchText={this.state.searchText}
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
        const { value } = this.props;
        return value ? this.renderSelectedOrgUnit(value) : this.renderCollapsedOrgUnitField();
    }
}
export const SingleOrgUnitSelectField = withStyles(getStyles)(SingleOrgUnitSelectFieldPlain);
