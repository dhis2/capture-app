// @flow
import { getApi } from '../../d2/d2Instance';

export async function getDhisIconAsync(name: string) {
    const icon = `${getApi().baseUrl}/icons/${name}/icon.svg`;
    return icon;
}
