// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    image: {
        width: 120,
        height: 80,
        objectFit: 'contain',
    },
});

const WorkingListImagePlain = (props: {
    url: string,
    classes: {
        image: string,
    },
}) => {
    const { url, classes } = props;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => { event.stopPropagation(); }}
        >
            <img
                src={url}
                className={classes.image}
            />
        </a>
    );
}

export const WorkingListImage = withStyles(styles)(WorkingListImagePlain);
