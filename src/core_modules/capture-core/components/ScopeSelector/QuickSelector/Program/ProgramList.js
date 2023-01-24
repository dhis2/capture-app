// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Menu, MenuItem } from '@dhis2/ui';

const getStyles = () => ({
    list: {
        padding: 0,
    },
    item: {
        wordBreak: 'break-word',
        hyphens: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginBottom: 5,
        padding: 5,
        border: '1px solid lightGrey',
        '&:hover': {
            backgroundColor: 'white',
            borderColor: '#71a4f8',
        },
    },
    itemContents: {
        display: 'flex',
        alignItems: 'center',
    },
});

type Item = { label: string, value: string, iconLeft: React.Node };

type Props = {
    items: Array<Item>,
    onSelect: (id: string) => void,
    classes: {
        list: string,
        item: string,
        itemContents: string,
    },
};

const ProgramListPlain = (props: Props) => {
    const { items, onSelect, classes } = props;
    return (
        <Menu className={classes.list}>
            {items.map(item =>
                (
                    <MenuItem
                        className={classes.item}
                        button
                        onClick={() => onSelect(item.value)}
                        key={item.value}
                        icon={item.iconLeft}
                        label={item.label}
                    />
                ),
            )}
        </Menu>
    );
};

export const ProgramList = withStyles(getStyles)(ProgramListPlain);
