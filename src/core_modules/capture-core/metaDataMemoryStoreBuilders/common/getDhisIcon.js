// @flow
import { getApi } from '../../d2/d2Instance';

export default async (name: string) => {
    const icon = `${getApi().baseUrl}/icons/${name}/icon.svg`;
    return icon;
};
