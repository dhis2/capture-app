// @flow
import { Icon } from '../../../../metaData';
import type {
    CachedStyle,
} from '../../../../storageControllers/cache.types';

export const buildIcon = (cachedStyle?: ?CachedStyle) => {
    const { color, icon: name } = cachedStyle || {};

    if (!color && !name) {
        return undefined;
    }

    return new Icon((_icon) => {
        _icon.color = color || undefined;
        _icon.name = name || undefined;
    });
};
