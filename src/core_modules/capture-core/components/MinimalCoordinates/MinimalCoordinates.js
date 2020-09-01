// @flow
import React from 'react';

type Props = $ReadOnly<{|
  latitude: number,
  longitude: number,
|}>;

const toSixDecimal = (value: number) => (value ? value.toFixed(6) : null);

export const MinimalCoordinates = ({ latitude, longitude }: Props) =>
    (<div>
        lat: {toSixDecimal(latitude)} <br />
        long: {toSixDecimal(longitude)}
    </div>);

