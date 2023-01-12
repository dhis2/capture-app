// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Input, Help, MenuItem, spacers, colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    input: {
        position: 'sticky',
        top: '0',
        background: `${colors.white}`,
        padding: `${spacers.dp8} ${spacers.dp8} ${spacers.dp4} ${spacers.dp8}`,
        zIndex: '1',
    },
});

type Option = {
    value: string,
    label: string,
};

type Props = {
    dataTest: string,
    options: Array<Option>,
    onChange: (option: Option) => void,
    searchText: string,
    ...CssClasses,
};

const FiltrableMenuItemsPlain = ({ dataTest, options, onChange, searchText, classes }: Props) => {
    const [filter, setFilter] = useState('');

    const filtered = options.reduce((acc, item) => {
        const match = item.label.toLowerCase().includes(filter.toLowerCase());
        return match ? [...acc, item] : acc;
    }, []);

    const hasMatch = filtered?.length > 0;

    return (
        <>
            <Input
                dense
                dataTest={`${dataTest}-filterinput`}
                value={filter}
                onChange={({ value }) => setFilter(value)}
                type="text"
                placeholder={searchText}
                initialFocus
                className={classes.input}
            />
            {hasMatch ? (
                filtered.map(option => (
                    <MenuItem key={option.value} label={option.label} value={option.value} onClick={onChange} />
                ))
            ) : (
                <MenuItem label={<Help error>{i18n.t('No match found')}</Help>} />
            )}
        </>
    );
};

export const FiltrableMenuItems = withStyles(styles)(FiltrableMenuItemsPlain);
