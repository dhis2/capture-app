import React from 'react';
import { Button, Popover } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';

import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { ChevronDown, ChevronUp } from 'capture-ui/Icons';
import { ActiveFilterButton } from './ActiveFilterButton.component';
import { FilterSelectorContents } from '../Contents';
import { LockedFilterButton } from './LockedFilterButton.component';
import type { UpdateFilter, ClearFilter, RemoveFilter } from '../../types';
import type { FilterData, Options, FilterDataInput } from '../../../FiltersForTypes';

const getStyles: Readonly<any> = (theme: any) => ({
    icon: {
        paddingLeft: theme.typography.pxToRem(12),
        display: 'flex',
        alignItems: 'center',
    },
    inactiveFilterButton: {
        backgroundColor: '#f5f5f5',
    },
    inactiveFilterButtonLabel: {
        textTransform: 'none',
    },
});

type Props = {
    itemId: string;
    type: string;
    options?: Options | null;
    multiValueFilter?: boolean;
    title: string;
    onUpdateFilter: UpdateFilter;
    onClearFilter: ClearFilter;
    onRemoveFilter: RemoveFilter;
    isRemovable?: boolean;
    onSetVisibleSelector: (itemId?: string | null) => void;
    selectorVisible: boolean;
    filterValue?: FilterDataInput;
    buttonText?: string;
    disabled?: boolean;
    tooltipContent?: string;
};

type State = {
    isMounted: boolean;
};

class FilterButtonMainPlain extends React.Component<Props & WithStyles<typeof getStyles>, State> {
    activeFilterButtonInstance: any;
    anchorRef: React.RefObject<HTMLDivElement>;
    constructor(props: Props & WithStyles<typeof getStyles>) {
        super(props);
        this.state = {
            isMounted: false,
        };
        this.anchorRef = React.createRef() as React.RefObject<HTMLDivElement>;
    }

    componentDidMount() {
        this.setState({  // eslint-disable-line
            isMounted: true,
        });
    }

    openFilterSelector = () => {
        const { itemId, onSetVisibleSelector } = this.props;
        onSetVisibleSelector(itemId);

        // onmouseleave is sometimes triggered when the popover opens, and sometimes not triggered at all 
        // (not even when the mouse actually leaves the button). Clears the hover here to avoid it remaining hovered.
        if (this.props.filterValue) {
            this.activeFilterButtonInstance && this.activeFilterButtonInstance.clearIsHovered();
        }
    }

    closeFilterSelector = () => {
        const { onSetVisibleSelector } = this.props;
        onSetVisibleSelector(undefined);
    }

    onClose = () => {
        this.handleFilterUpdate(null);
    }

    onRemove = () => {
        const { itemId, onRemoveFilter } = this.props;
        this.closeFilterSelector();
        onRemoveFilter && onRemoveFilter(itemId);
    }

    handleFilterUpdate = (data: FilterData | null) => {
        const { itemId, onUpdateFilter, onClearFilter } = this.props;
        if (data == null) {
            onClearFilter(itemId);
        } else {
            onUpdateFilter(data, itemId);
        }
        this.closeFilterSelector();
    }

    handleClearFilter = () => {
        const { itemId, onClearFilter } = this.props;
        onClearFilter(itemId);
    }

    renderSelectorContents() {
        const { itemId: id, type, options, multiValueFilter, filterValue, isRemovable } = this.props;

        return (
            <FilterSelectorContents
                type={type}
                options={options}
                multiValueFilter={multiValueFilter}
                id={id}
                onUpdate={this.handleFilterUpdate}
                onClose={this.onClose}
                filterValue={filterValue}
                onRemove={this.onRemove}
                isRemovable={isRemovable}
            />
        );
    }

    refActiveFilterInstance = (activeFilterButtonInstance: any) => {
        this.activeFilterButtonInstance = activeFilterButtonInstance;
    }

    renderActiveFilterButton() {
        const { selectorVisible, classes, title, buttonText } = this.props;

        const arrowIconElement = selectorVisible ? (
            <span className={classes.icon}>
                <ChevronUp />
            </span>
        ) : (
            <span className={classes.icon}>
                <ChevronDown />
            </span>
        );

        return (
            <ActiveFilterButton
                innerRef={this.refActiveFilterInstance}
                onChange={this.openFilterSelector}
                onClear={this.handleClearFilter}
                iconClass={classes.icon}
                title={title}
                arrowIconElement={arrowIconElement}
                buttonText={buttonText}
            />
        );
    }

    renderWithAppliedFilter() {
        const { filterValue, title, buttonText } = this.props;

        if (filterValue?.locked) {
            return (
                <LockedFilterButton
                    title={title}
                    buttonText={buttonText}
                />
            );
        }

        return this.renderActiveFilterButton();
    }

    renderWithoutAppliedFilter() {
        const { selectorVisible, classes, title, disabled, tooltipContent } = this.props;

        return (
            <ConditionalTooltip
                content={tooltipContent}
                enabled={!!disabled}
                closeDelay={50}
            >
                <Button
                    disabled={disabled}
                    onClick={this.openFilterSelector}
                >
                    {title}
                    <span className={classes.icon}>
                        {selectorVisible ? <ChevronUp /> : <ChevronDown />}
                    </span>
                </Button>
            </ConditionalTooltip>
        );
    }

    render() {
        const { filterValue, selectorVisible } = this.props;
        const { isMounted } = this.state;

        const button = filterValue ? this.renderWithAppliedFilter() : this.renderWithoutAppliedFilter();

        return (
            <React.Fragment>
                <div
                    data-test="filter-button-popover-anchor"
                    ref={this.anchorRef}
                >
                    {button}
                </div>
                {(selectorVisible && isMounted) && (
                    <Popover
                        reference={this.anchorRef.current || undefined}
                        arrow={false}
                        placement="bottom-start"
                        onClickOutside={this.closeFilterSelector}
                        maxWidth={400}
                    >
                        {
                            (() => {
                                if (selectorVisible) {
                                    return this.renderSelectorContents();
                                }
                                return null;
                            })()
                        }
                    </Popover>
                )}
            </React.Fragment>
        );
    }
}

export const FilterButtonMain = withStyles(getStyles)(FilterButtonMainPlain);
