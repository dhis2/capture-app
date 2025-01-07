// @flow
import React, { useCallback, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { DropdownButton, spacers, FlyoutMenu, MenuItem, Divider } from '@dhis2/ui';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'start',
        padding: `0 0 ${spacers.dp8} 0`,
        gap: spacers.dp8,
    },
};

type RecordType = {
    reactKey: string;
    date: string;
    user: string;
    username: string;
    dataItemId: string;
    dataItemLabel: string;
    changeType: string;
    currentValue: string;
    previousValue: string;
};

type Props = {
    classes: { container: string },
    records: Array<RecordType>,
    filterValue: Object,
    setFilterValue: (value: string) => void,
    columnToFilterBy: string,
    setColumnToFilterBy: (value: string | null) => void,
    dataItemDefinitions: {
        [key: string]: {
            id: string,
            name: string,
            type: string,
            optionSet?: string,
            options?: Array<{ code: string, name: string }>,
        },
    },
};

const ChangelogFilterBarPlain = ({
    classes,
    records,
    filterValue,
    setFilterValue,
    columnToFilterBy,
    setColumnToFilterBy,
    dataItemDefinitions,
}: Props) => {
    const users = useMemo(
        () => [
            ...new Map(
                records.map(record => [record.user, { id: record.user, name: record.username }]),
            ).values(),
        ],
        [records],
    );

    const dataItems = useMemo(
        () =>
            Object.keys(dataItemDefinitions).map(key => ({
                id: key,
                name: dataItemDefinitions[key].name,
            })),
        [dataItemDefinitions],
    );

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = useCallback((menuName: string) => {
        setOpenMenu(prev => (prev === menuName ? null : menuName));
    }, []);

    const handleItemSelected = useCallback(
        (value: Object, filterColumn: string) => {
            setOpenMenu(null);

            if (value === 'Show all') {
                setFilterValue('Show all');
                setColumnToFilterBy(null);
            } else {
                setFilterValue(value);
                setColumnToFilterBy(filterColumn);
            }
        },
        [setOpenMenu, setFilterValue, setColumnToFilterBy],
    );

    const renderMenuItemsDataItems = useCallback(() => dataItems.map(value => (
        <MenuItem
            key={value.id}
            onClick={() => handleItemSelected(value, 'dataElement')}
            label={value.name}
        />
    )), [dataItems, handleItemSelected]);

    const renderMenuItemsUsers = useCallback(() => users.map(value => (
        <MenuItem
            key={value.id}
            onClick={() => handleItemSelected(value, 'username')}
            label={value.name}
        />
    )), [users, handleItemSelected]);

    return (
        <div className={classes.container}>
            <div>
                <DropdownButton
                    className="filter-button"
                    open={openMenu === 'username'}
                    onClick={() => toggleMenu('username')}
                    component={
                        openMenu === 'username' && (
                            <FlyoutMenu
                                role="menu"
                                dataTest="changelog-filter-user"
                                maxHeight="300px"
                            >
                                <MenuItem
                                    key="all-users"
                                    onClick={() => handleItemSelected('Show all', 'username')}
                                    label={i18n.t('Show all')}
                                />
                                <Divider />
                                {renderMenuItemsUsers()}
                            </FlyoutMenu>
                        )
                    }
                >
                    {i18n.t(
                        `User ${
                            columnToFilterBy === 'username' && filterValue !== 'Show all'
                                ? filterValue?.name
                                : i18n.t('Show all')
                        }`,
                    )}
                </DropdownButton>
            </div>
            <div>
                <DropdownButton
                    className="filter-button"
                    open={openMenu === 'dataElement'}
                    onClick={() => toggleMenu('dataElement')}
                    component={
                        openMenu === 'dataElement' && (
                            <FlyoutMenu
                                role="menu"
                                dataTest="changelog-filter-dataitem"
                                maxHeight="300px"
                            >
                                <MenuItem
                                    key="all-dataitem"
                                    onClick={() => handleItemSelected('Show all', 'dataElement')}
                                    label={i18n.t('Show all')}
                                />
                                <Divider />
                                {renderMenuItemsDataItems()}
                            </FlyoutMenu>
                        )
                    }
                >
                    {i18n.t(
                        `Data item ${
                            columnToFilterBy === 'dataElement' && filterValue !== 'Show all'
                                ? filterValue?.name
                                : i18n.t('Show all')
                        }`,
                    )}
                </DropdownButton>
            </div>
        </div>
    );
};

export const ChangelogFilterBar = withStyles(styles)(ChangelogFilterBarPlain);
