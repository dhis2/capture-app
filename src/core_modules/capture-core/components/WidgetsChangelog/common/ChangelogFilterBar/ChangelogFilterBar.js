// @flow
import React, { useMemo, useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import type { ChangelogFilterProps, FilterValueType } from './ChangelogFilter.types';
import { DropdownFilter } from './DropdownFilter';

const styles = {
    container: {
        padding: `0 0 ${spacers.dp8} 0`,
    },
};

const getFilterColumn = (id: string) =>
    (['occurredAt', 'scheduledAt', 'geometry'].includes(id)
        ? 'field'
        : 'dataElement');

const ChangelogFilterBarPlain = ({
    classes,
    filterValue,
    setFilterValue,
    attributeToFilterBy,
    setAttributeToFilterBy,
    dataItemDefinitions,
}: ChangelogFilterProps) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = useCallback((menuName: string) => {
        setOpenMenu(prev => (prev === menuName ? null : menuName));
    }, []);

    const handleItemSelected = useCallback(
        (value: FilterValueType) => {
            setOpenMenu(null);
            if (value === 'SHOW_ALL') {
                setFilterValue('SHOW_ALL');
                setAttributeToFilterBy(null);
            } else {
                const column = getFilterColumn(value.id);
                setFilterValue(value);
                setAttributeToFilterBy(column);
            }
        },
        [setFilterValue, setAttributeToFilterBy],
    );

    const dataItems = useMemo(
        () =>
            Object.keys(dataItemDefinitions).map(key => ({
                id: key,
                name: dataItemDefinitions[key].name,
            })),
        [dataItemDefinitions],
    );

    const selectedFilterValue = attributeToFilterBy ? filterValue : 'SHOW_ALL';

    return (
        <div className={classes.container}>
            <DropdownFilter
                label={i18n.t('Data item')}
                items={dataItems}
                filterColumn="dataItem"
                openMenuName={openMenu}
                onToggleMenu={toggleMenu}
                onItemSelected={handleItemSelected}
                selectedFilterValue={selectedFilterValue}
            />
        </div>
    );
};

export const ChangelogFilterBar = withStyles(styles)(ChangelogFilterBarPlain);
