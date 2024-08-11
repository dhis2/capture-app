// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const sizes = {
    extrasmall: {
        height: 24,
        width: 24,
    },
    small: {
        height: 36,
        width: 36,
    },
    medium: {
        height: 48,
        width: 48,
    },
    large: {
        height: 72,
        width: 72,
    },
    extralarge: {
        height: 144,
        width: 144,
    },
};

const styles = {
    img: {
        borderRadius: '50%',
        objectFit: 'cover',
    },
    ...sizes,
};

type Props = {
    imageUrl: string,
    dataTest: string,
    classes: Object,
    className: Object,
    size: 'extrasmall' | 'small' | 'medium' | 'large' | 'extralarge',
};

const CardImagePlain = ({ imageUrl, dataTest, classes, className, size }: Props) => (
    <div className={className}>
        <img
            src={imageUrl}
            alt="user avatar"
            data-test={dataTest}
            className={`${classes.img} ${classes[size]} className`}
        />
    </div>
);


export const CardImage = withStyles(styles)(CardImagePlain);
