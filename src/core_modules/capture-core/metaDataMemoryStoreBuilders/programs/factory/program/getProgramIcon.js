// @flow
import defaultIcon from '@dhis2/d2-icons/icons/clinical_fe_outline.svg';
import getDhisIconAsync from '../../../common/getDhisIcon';

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
