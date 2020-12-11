// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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

const ProgramList = (props: Props) => {
  const { items, onSelect, classes } = props;
  return (
    <List className={classes.list}>
      {items.map((item) => (
        <ListItem
          className={classes.item}
          button
          onClick={() => onSelect(item.value)}
          key={item.value}
        >
          <ListItemText
            primary={
              <div className={classes.itemContents}>
                {item.iconLeft}
                {item.label}
              </div>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default withStyles(getStyles)(ProgramList);
