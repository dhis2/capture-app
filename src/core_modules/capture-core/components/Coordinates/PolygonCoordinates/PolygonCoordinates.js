// @flow
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { IconChevronUp16, IconChevronDown16, colors, spacers } from '@dhis2/ui';

type Props = $ReadOnly<{|
    coordinates: Array<Array<number>>,
    classes: {
        buttonContainer: string,
        viewButton: string,
    },
|}>;

const styles = {
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    viewButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: colors.grey800,
        marginTop: spacers.dp8,
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
            textDecoration: 'underline',
            color: 'black',
        },
    },
};

const PolygonCoordinatesPlain = ({ coordinates, classes }: Props) => {
    const [showMore, setShowMore] = useState(false);
    return (
        <>
            <div>
                {coordinates.slice(0, showMore ? coordinates.length : 1).map((coordinatePair, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                        {`lat: ${coordinatePair[1]}`}<br />
                        {`long: ${coordinatePair[0]}`}
                    </div>
                ))}
            </div>
            <div className={classes.buttonContainer}>
                <button className={classes.viewButton} onClick={() => setShowMore(!showMore)}>
                    {showMore ? 'Show Less' : 'Show More'}
                    {showMore ? <IconChevronUp16 /> : <IconChevronDown16 />}
                </button>
            </div>
        </>
    );
};

export const PolygonCoordinates = withStyles(styles)(PolygonCoordinatesPlain);
