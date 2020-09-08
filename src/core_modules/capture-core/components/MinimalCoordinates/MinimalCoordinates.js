// @flow
import React from 'react';

type Props = $ReadOnly<{|
  latitude: number | string,
  longitude: number | string,
|}>;

const toSixDecimal = value => (parseFloat(value) ? parseFloat(value).toFixed(6) : null);

export const MinimalCoordinates = ({ latitude, longitude }: Props) =>
    (<div>
        lat: {toSixDecimal(latitude)} <br />
        long: {toSixDecimal(longitude)}
    </div>);

