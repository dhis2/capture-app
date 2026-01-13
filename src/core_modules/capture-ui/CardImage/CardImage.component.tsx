import React from 'react';
import { cx } from '@emotion/css';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { PlainProps } from './CardImage.types';

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

const styles: Readonly<any> = {
    img: {
        borderRadius: '50%',
        objectFit: 'cover',
    },
    ...sizes,
};

type Props = PlainProps & WithStyles<typeof styles>;

const CardImagePlain = ({ imageUrl, dataTest, classes, className, size }: Props) => (
    <div className={className}>
        <img
            src={imageUrl}
            alt="user avatar"
            data-test={dataTest}
            className={cx(classes.img, size && classes[size])}
        />
    </div>
);

export const CardImage = withStyles(styles)(CardImagePlain);
