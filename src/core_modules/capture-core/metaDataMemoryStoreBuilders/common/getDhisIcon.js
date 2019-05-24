// @flow
import { getApi } from '../../d2/d2Instance';
// import { ReactComponent as Test } from '@dhis2/d2-icons/icons/alert_positive.svg';

export default async (name: string) => {
    let icon;
    try {
        // $FlowFixMe
        // icon = await import(/* webpackMode: "eager" */ `@dhis2/d2-icons/icons/${name}.svg`);
        icon = `${getApi().baseUrl}/icons/${name}/icon.svg`;
    } catch (error) {
        icon = `${getApi().baseUrl}/icons/${name}/icon.svg`;
    }
    return icon;
};
