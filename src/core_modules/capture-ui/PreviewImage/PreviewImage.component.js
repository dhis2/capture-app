// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const width = 120;
const height = 80;

const getStyles = () => ({
    container: {
        width,
        height,
    },
    imageContainer: {
        position: 'relative',
        display: 'inline-block',
        '&:hover $image': {
            opacity: 0.5,
        },
        '&:hover $icon': {
            visibility: 'visible',
        },
    },
    image: {
        maxWidth: width,
        height,
        objectFit: 'contain',
    },
    icon: {
        position: 'absolute',
        padding: '4px 4px 2px 4px',
        left: '50%',
        bottom: '50%',
        transform: 'translate(-50%, 50%)',
        background: 'rgba(255, 255, 255, 0.5)',
        cursor: 'pointer',
        visibility: 'hidden',
    },
});

const PreviewImagePlain = (props: {
    url: string,
    previewUrl: string,
    alignLeft?: boolean,
    classes: {
        container: string,
        imageContainer: string,
        image: string,
        icon: string,
    },
}) => {
    const { url, previewUrl, alignLeft, classes } = props;
    const imageWidth = alignLeft ? undefined : width;

    return (
        <div className={classes.container}>
            <div className={classes.imageContainer}>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => { event.stopPropagation(); }}
                >
                    <img
                        src={previewUrl}
                        className={classes.image}
                        width={imageWidth}
                    />
                    <div className={classes.icon}>
                        {/* Todo: Change to UI zoom in icon */}
                        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M22 11C22.0017 13.5613 21.0978 16.0408 19.4479 18L27 25.5859L25.5859 27L18 19.4479C16.0408 21.0978 13.5613 22.0017 11 22C8.82441 22 6.69767 21.3549 4.88873 20.1462C3.07979 18.9375 1.66989 17.2195 0.83733 15.2095C0.00476616 13.1995 -0.213071 10.9878 0.211367 8.85401C0.635804 6.72022 1.68345 4.76021 3.22183 3.22183C4.76021 1.68345 6.72022 0.635804 8.85401 0.211367C10.9878 -0.213071 13.1995 0.00476616 15.2095 0.83733C17.2195 1.66989 18.9375 3.07979 20.1462 4.88873C21.3549 6.69767 22 8.82441 22 11ZM5.99987 18.4832C7.47992 19.4722 9.21997 20 11 20C13.3861 19.9974 15.6738 19.0483 17.361 17.361C19.0483 15.6738 19.9974 13.3861 20 11C20 9.21997 19.4722 7.47992 18.4832 5.99987C17.4943 4.51983 16.0887 3.36628 14.4442 2.68509C12.7996 2.0039 10.99 1.82567 9.24419 2.17294C7.49836 2.5202 5.89472 3.37737 4.63604 4.63604C3.37737 5.89472 2.5202 7.49836 2.17294 9.24419C1.82567 10.99 2.0039 12.7996 2.68509 14.4442C3.36628 16.0887 4.51983 17.4943 5.99987 18.4832ZM12 10H16V12H12V16H10V12H6V10H10V6H12V10Z" fill="#212934" />
                        </svg>
                    </div>
                </a>
            </div>
        </div>
    );
};

export const PreviewImage = withStyles(getStyles)(PreviewImagePlain);
