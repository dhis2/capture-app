import type {
    CachedOptionSet,
    CachedOptionGroup,
} from '../../../../storageControllers';
import type { DataElement } from '../../../../metaData';

export type OptionSetFactoryTranslationPropertyNames = {
    NAME: 'NAME';
    DESCRIPTION: 'DESCRIPTION';
    SHORT_NAME: 'SHORT_NAME';
};

export type OptionSetFactoryProps = {
    cachedOptionSets: Map<string, CachedOptionSet>;
    cachedOptionGroups?: CachedOptionGroup[];
    locale?: string;
};

export type BuildOptionSetParams = {
    dataElement: DataElement;
    optionSetId: string;
    renderOptionsAsRadio?: boolean;
    renderType?: string;
    onGetDataElementType: (valueType: string) => string;
};
