// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconChevronUp16, IconChevronDown16, colors, spacers } from '@dhis2/ui';

type Props = $ReadOnly<{|
    coordinates: Array<Array<number>>,
|}>;

export const PolygonCoordinates = ({ coordinates }: Props) => {
    const [showMore, setShowMore] = useState(false);
    return (
        <div className="polygon-coordinates">
            <div className="coordinates-list">
                {coordinates.slice(0, showMore ? coordinates.length : 1).map((coordinatePair, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index} className="coordinate-pair">
                        {`${i18n.t('lat')}: ${coordinatePair[1]}`}<br />
                        {`${i18n.t('long')}: ${coordinatePair[0]}`}
                    </div>
                ))}
            </div>
            <div className="button-container">
                <button className="view-button" onClick={() => setShowMore(!showMore)}>
                    {showMore ? i18n.t('Show less') : i18n.t('Show more')}
                    {showMore ? <IconChevronUp16 /> : <IconChevronDown16 />}
                </button>
            </div>

            <style jsx>{`
                .coordinates-list {
                    margin-bottom: ${spacers.dp4}px;
                }
                .coordinate-pair {
                    margin-bottom: ${spacers.dp4}px;
                }
                .button-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .view-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: ${colors.grey800};
                    margin-top: ${spacers.dp8}px;
                    display: flex;
                    align-items: center;
                }
                .view-button:hover {
                    text-decoration: underline;
                    color: black;
                }
            `}</style>
        </div>
    );
};

