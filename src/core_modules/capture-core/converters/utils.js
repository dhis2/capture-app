// @flow
import React from 'react';

type Coordinates = $ReadOnly<{|
  latitude: number,
  longitude: number,
|}>;

const toSixDecimal = (value: number) => (value ? value.toFixed(6) : null);

export const displayCoordinates = ({ latitude, longitude }: Coordinates) =>
    (<div>
        lat: {toSixDecimal(latitude)} <br />
        long: {toSixDecimal(longitude)}
    </div>);

