import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { debounce } from 'lodash';
import { v4 as uuid } from 'uuid';
import { Chip, Popover, IconChevronDown16, colors } from '@dhis2/ui';
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
    trigger: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box' as const,
        minHeight: 40,
        padding: '6px 12px',
        border: `1px solid ${colors.grey500}`,
        borderRadius: 3,
        backgroundColor: 'white',
        boxShadow: 'inset 0 0 1px 0 rgba(48, 54, 60, 0.1)',
        color: colors.grey900,
        '&:focus-within': {
            outline: 'none',
            borderColor: colors.blue600,
            boxShadow: `inset 0 0 0 2px ${colors.blue600}`,
        },
    },
    triggerOpen: {
        borderColor: colors.blue600,
        boxShadow: `inset 0 0 0 2px ${colors.blue600}`,
    },
    triggerDisabled: {
        backgroundColor: colors.grey100,
        color: colors.grey600,
        cursor: 'not-allowed',
    },
    searchInput: {
        flexGrow: 1,
        minWidth: 0,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        padding: 0,
        fontSize: 14,
        lineHeight: '16px',
        color: 'inherit',
        cursor: 'inherit',
    },
    chevron: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        padding: 0,
        border: 0,
        background: 'none',
        cursor: 'inherit',
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
    inputValue: string;
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
    searchInputRef: React.RefObject<HTMLInputElement>;
    popoverId: string;
    debouncedSetSearchText: ((searchText: string) => void) & { cancel: () => void };

    constructor(props: Props) {
        super(props);
        this.state = {
            previousOrgUnitId: null,
            open: false,
            inputValue: '',
            searchText: '',
        };
        this.anchorRef = React.createRef() as React.RefObject<HTMLDivElement>;
        this.searchInputRef = React.createRef() as React.RefObject<HTMLInputElement>;
        this.popoverId = `org-unit-selector-popover-${uuid()}`;
        this.debouncedSetSearchText = debounce((searchText: string) => {
            this.setState({ searchText });
        }, 300);
    }

    componentWillUnmount() {
        this.debouncedSetSearchText.cancel();
    }

    openMenu = () => {
        if (this.props.disabled) {
            return;
        }
        this.setState({ open: true }, () => {
            this.searchInputRef.current?.focus();
        });
    }

    closeMenu = () => {
        this.debouncedSetSearchText.cancel();
        this.setState({ open: false, inputValue: '', searchText: '' });
    }

    onSelectOrgUnit = (orgUnit: Record<string, any>) => {
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

    handleSelect = (orgUnit: Record<string, any>) => {
        if (this.props.onSelectClick) {
            this.props.onSelectClick(orgUnit);
        } else {
            this.onSelectOrgUnit(orgUnit);
        }
        this.closeMenu();
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.currentTarget.value;
        this.setState({ inputValue });
        this.debouncedSetSearchText(inputValue);
    }

    handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (this.props.disabled) {
            return;
        }
        if (this.state.open && (event.key === 'Escape' || event.key === 'Tab')) {
            this.closeMenu();
        } else if (!this.state.open && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown')) {
            event.preventDefault();
            this.openMenu();
        }
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

    renderPopover = () => {
        const { classes, value, onBlur, onSelectClick, disabled, maxTreeHeight, ...passOnProps } = this.props;
        return (
            <Popover
                reference={this.anchorRef.current || undefined}
                arrow={false}
                placement="bottom-start"
                onClickOutside={this.closeMenu}
                maxWidth={400}
            >
                <div id={this.popoverId} className={classes.popoverContent}>
                    <OrgUnitField
                        {...passOnProps}
                        hideSearchField
                        searchText={this.state.searchText}
                        disabled={disabled}
                        maxTreeHeight={maxTreeHeight ?? 350}
                        onSelectClick={this.handleSelect}
                        onBlur={() => undefined}
                        previousOrgUnitId={this.state.previousOrgUnitId}
                    />
                </div>
            </Popover>
        );
    }

    renderCollapsedOrgUnitField = () => {
        const { classes, disabled } = this.props;
        const { open, inputValue } = this.state;
        const triggerClassName = [
            classes.trigger,
            open && classes.triggerOpen,
            disabled && classes.triggerDisabled,
        ].filter(Boolean).join(' ');

        return (
            <React.Fragment>
                <div
                    ref={this.anchorRef}
                    className={triggerClassName}
                >
                    <input
                        ref={this.searchInputRef}
                        className={classes.searchInput}
                        value={open ? inputValue : ''}
                        onChange={this.handleInputChange}
                        onClick={this.openMenu}
                        onKeyDown={this.handleKeyDown}
                        readOnly={!open}
                        disabled={disabled}
                        placeholder={open ? i18n.t('Search for an organisation unit') : undefined}
                        aria-haspopup="tree"
                        aria-controls={open ? this.popoverId : undefined}
                        data-test="org-unit-selector-trigger"
                    />
                    <button
                        type="button"
                        className={classes.chevron}
                        onClick={this.openMenu}
                        disabled={disabled}
                        tabIndex={-1}
                        aria-hidden="true"
                    >
                        <IconChevronDown16 />
                    </button>
                </div>
                {open && !disabled && this.renderPopover()}
            </React.Fragment>
        );
    }

    render() {
        const { value } = this.props;
        return value ? this.renderSelectedOrgUnit(value) : this.renderCollapsedOrgUnitField();
    }
}
export const SingleOrgUnitSelectField = withStyles(getStyles)(SingleOrgUnitSelectFieldPlain);
