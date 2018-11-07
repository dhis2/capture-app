// @flow
import defaultIcon from 'dhis2-icons/icons/square_large_negative.svg';
import getDhisIconAsync from './getDhisIcon';

export default async (name: ?string) => {
    if (!name) {
        return defaultIcon;
    }

    let icon;
    try {
        icon = await getDhisIconAsync(name);
    } catch (error) {
        icon = defaultIcon;
    }

    return icon;
};
