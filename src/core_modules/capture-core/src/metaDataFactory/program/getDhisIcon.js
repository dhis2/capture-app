// @flow
import { getApi } from '../../d2/d2Instance';

export default async (name: string) => {
    let icon;
    try {
        // $FlowFixMe
        icon = await import(/* webpackMode: "eager" */ `dhis2-icons/icons/${name}.svg`);
    } catch (error) {
        icon = `${getApi().baseUrl}/icons/${name}/icon.svg`;
    }
    return icon;
};
