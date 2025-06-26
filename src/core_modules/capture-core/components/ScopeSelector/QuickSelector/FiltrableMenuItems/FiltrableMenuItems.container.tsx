import * as React from 'react';
import { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Input, MenuItem, spacers, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { OptionLabel } from '../../OptionLabel';
import type { Icon } from '../../../../metaData';

const styles: Readonly<any> = {
    input: {
        position: 'sticky',
        top: '0',
        background: `${colors.white}`,
        padding: `${spacers.dp8} ${spacers.dp8} ${spacers.dp4} ${spacers.dp8}`,
        zIndex: '1',
    },
    empty: {
        fontSize: '14px',
        color: `${colors.grey700}`,
        display: 'flex',
        justifyContent: 'center',
        padding: `${spacers.dp16} ${spacers.dp8}`,
    },
};

type Option = {
    value: string;
    label: string;
    icon?: Icon;
};

type OwnProps = {
    dataTest: string;
    options: Array<Option>;
    onChange: (option: { value?: string; }) => void;
    searchText: string;
};

type Props = OwnProps & WithStyles<typeof styles>;

const FiltrableMenuItemsPlain = ({ dataTest, options, onChange, searchText, classes }: Props) => {
    const [filter, setFilter] = useState('');

    const filtered = options.reduce((acc: Option[], item) => {
        const match = item.label.toLowerCase().includes(filter.toLowerCase());
        return match ? [...acc, item] : acc;
    }, [] as Option[]);

    const hasMatch = filtered?.length > 0;

    return (
        <>
            <Input
                dense
                dataTest={`${dataTest}-filterinput`}
                value={filter}
                onChange={({ value }) => setFilter(value || '')}
                type="text"
                placeholder={searchText}
                initialFocus
                className={classes.input}
            />
            {hasMatch ? (
                filtered.map(option => (
                    <MenuItem
                        key={option.value}
                        label={<OptionLabel icon={option.icon} label={option.label} />}
                        value={option.value}
                        suffix=""
                        onClick={onChange}
                    />
                ))
            ) : (
                <div className={classes.empty}><span>{i18n.t('No results found for ')}{filter}</span></div>
            )}
        </>
    );
};

export const FiltrableMenuItems = withStyles(styles)(FiltrableMenuItemsPlain);
