// @flow
import React, { useMemo, useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import type {
    ChangelogFilterProps,
    FilterValueType,
} from './ChangelogFilter.types';
import { DropdownFilter } from './DropdownFilter';

const styles = {
    container: {
        padding: `0 0 ${spacers.dp8} 0`,
    },
};

const ChangelogFilterBarPlain = ({
    classes,
    filterValue,
    setFilterValue,
    columnToFilterBy,
    setColumnToFilterBy,
    dataItemDefinitions,
}: ChangelogFilterProps) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = useCallback((menuName: string) => {
        setOpenMenu(prev => (prev === menuName ? null : menuName));
    }, []);

    const handleItemSelected = useCallback(
        (value: FilterValueType, filterColumn: string) => {
            setOpenMenu(null);
            if (value === 'SHOW_ALL') {
                setFilterValue('SHOW_ALL');
                setColumnToFilterBy(null);
            } else {
                setFilterValue(value);
                setColumnToFilterBy(filterColumn);
            }
        },
        [setFilterValue, setColumnToFilterBy],
    );

    const dataItems = useMemo(
        () => Object.keys(dataItemDefinitions).map(key => ({
            id: key,
            name: dataItemDefinitions[key].name,
        })),
        [dataItemDefinitions],
    );

    return (
        <div className={classes.container}>
            <DropdownFilter
                label={i18n.t('Data item')}
                items={dataItems}
                filterColumn="dataElement"
                openMenuName={openMenu}
                onToggleMenu={toggleMenu}
                onItemSelected={handleItemSelected}
                selectedFilterValue={columnToFilterBy === 'dataElement' ? filterValue : 'SHOW_ALL'}
            />
        </div>
    );
};

export const ChangelogFilterBar = withStyles(styles)(ChangelogFilterBarPlain);
