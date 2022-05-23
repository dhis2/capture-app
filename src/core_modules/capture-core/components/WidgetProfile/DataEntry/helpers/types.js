// @flow

export type Geometry = {
    type: string,
    coordinates: Array<Array<Array<number>>> | { latitude: number, longitude: number },
};
