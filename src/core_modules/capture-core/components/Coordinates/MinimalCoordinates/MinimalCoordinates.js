// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';

type Props = $ReadOnly<{|
  latitude: number | string,
  longitude: number | string,
|}>;

const toSixDecimal = value => (parseFloat(value) ? parseFloat(value).toFixed(6) : null);

export const MinimalCoordinates = ({ latitude, longitude }: Props) => (
    <div>
        {i18n.t('Lat')}: {toSixDecimal(latitude)}<br />
        {i18n.t('Long')}: {toSixDecimal(longitude)}
    </div>
);

