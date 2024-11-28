// @flow
import React, { useState } from 'react';
import { IconArrowRight16, IconChevronUp16, IconChevronDown16 } from '@dhis2/ui';
import { CHANGE_TYPES } from '../../../../Changelog/Changelog.constants';
import type { ChangelogValueCellProps } from './ChangelogValueCellComponents.types';

const ValueDisplay = ({ value, showMore, className }) => (
    <span className={className}>{showMore ? value : value?.[0]}</span>
);

const ViewMoreButton = ({ showMore, onClick, classes }) => (
    <button className={classes.viewButton} onClick={onClick}>
        {showMore ? 'View less' : 'View more'}
        {showMore ? <IconChevronUp16 /> : <IconChevronDown16 />}
    </button>
);

const Updated = ({ previousValue, currentValue, classes }: ChangelogValueCellProps) => {
    const [showMore, setShowMore] = useState(false);

    return (
        <>
            <div className={classes.container}>
                <ValueDisplay
                    value={previousValue}
                    showMore={showMore}
                    className={classes.previousValue}
                />
                <span className={classes.updateArrow}>
                    <IconArrowRight16 />
                </span>
                <ValueDisplay
                    value={currentValue}
                    showMore={showMore}
                    className={classes.currentValue}
                />
            </div>
            <div className={classes.buttonContainer}>
                <ViewMoreButton
                    showMore={showMore}
                    onClick={() => setShowMore(!showMore)}
                    classes={classes}
                />
            </div>
        </>

    );
};


const Created = ({ currentValue, classes }: ChangelogValueCellProps) => {
    const [showMore, setShowMore] = useState(false);

    return (
        <>
            <div className={classes.container}>
                <ValueDisplay
                    value={currentValue}
                    showMore={showMore}
                    className={classes.currentValue}
                />
            </div>
            <div className={classes.buttonContainer}>
                <ViewMoreButton
                    showMore={showMore}
                    onClick={() => setShowMore(!showMore)}
                    classes={classes}
                />
            </div>
        </>
    );
};

const Deleted = ({ previousValue, classes }: ChangelogValueCellProps) => {
    const [showMore, setShowMore] = useState(false);

    return (
        <>
            <div className={classes.container}>
                <ValueDisplay
                    value={previousValue}
                    showMore={showMore}
                    className={classes.previousValue}
                />
            </div>
            <div className={classes.buttonContainer}>
                <ViewMoreButton
                    showMore={showMore}
                    onClick={() => setShowMore(!showMore)}
                    classes={classes}
                />
            </div>
        </>

    );
};

export const PlygonChangelogComponentsByChangeType = Object.freeze({
    [CHANGE_TYPES.UPDATED]: Updated,
    [CHANGE_TYPES.CREATED]: Created,
    [CHANGE_TYPES.DELETED]: Deleted,
});
