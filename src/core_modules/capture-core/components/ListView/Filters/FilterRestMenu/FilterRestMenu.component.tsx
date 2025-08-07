import React, { useState, useCallback } from 'react';
import { FlyoutMenu, MenuItem, DropdownButton } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { Column, FilterOnly } from '../../types';

type Props = {
    columns: Array<Column | FilterOnly>;
    onItemSelected: (id: string) => void;
};

export const FilterRestMenu = ({ columns, onItemSelected }: Props) => {
    const [filterSelectorOpen, setFilterSelectorOpen] = useState(false);

    const toggleMenu = useCallback(() => {
        setFilterSelectorOpen(prevState => !prevState);
    }, []);

    const handleItemSelected = useCallback((id: string) => {
        setFilterSelectorOpen(false);
        onItemSelected(id);
    }, [onItemSelected]);

    const renderMenuItems = useCallback(() => (
        columns.map(column => (
            <MenuItem
                key={column.id}
                onClick={() => handleItemSelected(column.id)}
                label={column.header}
                suffix={null}
            />
        ))
    ), [columns, handleItemSelected]);

    return (
        <DropdownButton
            dataTest="more-filters"
            onClick={toggleMenu}
            open={filterSelectorOpen}
            component={
                <FlyoutMenu
                    dataTest="more-filters-menu"
                    maxHeight="300px"
                >
                    {renderMenuItems()}
                </FlyoutMenu>
            }
        >
            {i18n.t('More filters')}
        </DropdownButton>
    );
};
