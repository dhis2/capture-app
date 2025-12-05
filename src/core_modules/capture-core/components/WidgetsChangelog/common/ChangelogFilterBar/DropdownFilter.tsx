import React, { useCallback } from 'react';
import { DropdownButton, FlyoutMenu, MenuItem, Divider, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import type { FilterValueType } from './ChangelogFilter.types';

type FilterItem = {
    id: string;
    name: string;
};

type OwnProps = {
    label: string;
    items: Array<FilterItem>;
    filterColumn: string;
    openMenuName: string | null;
    onToggleMenu: (menuName: string) => void;
    onItemSelected: (value: FilterValueType, filterColumn: string) => void;
    selectedFilterValue: FilterValueType;
};

const styles = {
    label: {
        color: colors.grey600,
    },
};

type Props = OwnProps & WithStyles<typeof styles>;

const DropdownFilterPlain = ({
    label,
    classes,
    items,
    filterColumn,
    openMenuName,
    onToggleMenu,
    onItemSelected,
    selectedFilterValue,
}: Props) => {
    const isMenuOpen = openMenuName === filterColumn;

    const handleShowAll = useCallback(() => {
        onItemSelected(null, filterColumn);
    }, [onItemSelected, filterColumn]);

    const filterValue = selectedFilterValue
        ? selectedFilterValue.name
        : i18n.t('Show all');

    return (
        <DropdownButton
            open={isMenuOpen}
            onClick={() => onToggleMenu(filterColumn)}
            dataTest={`changelog-filter-${filterColumn}`}
            component={
                isMenuOpen ? (
                    <FlyoutMenu
                        dataTest={`changelog-filter-${filterColumn}-flyoutmenu`}
                        maxHeight="300px"
                    >
                        <MenuItem
                            key={'showAll'}
                            onClick={() => {
                                handleShowAll();
                                onToggleMenu(filterColumn);
                            }}
                            label={i18n.t('Show all')}
                            suffix={null}
                        />
                        <Divider />
                        {items.map(item => (
                            <MenuItem
                                key={item.id}
                                onClick={() => {
                                    onItemSelected(item, filterColumn);
                                    onToggleMenu(filterColumn);
                                }}
                                label={item.name}
                                suffix={null}
                            />
                        ))}
                    </FlyoutMenu>
                ) : undefined
            }
        >
            <span className={classes.label}>{label}</span>&nbsp;{filterValue}
        </DropdownButton>
    );
};

export const DropdownFilter = withStyles(styles)(DropdownFilterPlain);
