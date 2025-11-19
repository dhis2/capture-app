import type { ComponentType } from 'react';

export type TargetSides = 'FROM' | 'TO';

export type Side = {
    readonly name: string;
    readonly targetSide: TargetSides;
};

type ApplicableTypeInfo<TSide extends Side> = {
    readonly id: string;
    readonly name: string;
    readonly sides: readonly TSide[];
};

type ApplicableTypesInfo<TSide extends Side> = readonly ApplicableTypeInfo<TSide>[];

export type LinkedEntityMetadata = Side & {
    readonly relationshipId: string;
};

export type Props<TLinkedEntityMetadata extends LinkedEntityMetadata, TSide extends Side> = {
    readonly applicableTypesInfo: ApplicableTypesInfo<TSide>;
    readonly onSelectLinkedEntityMetadata: (linkedEntityMetadata: TLinkedEntityMetadata) => void;
};

export type PlainProps<TLinkedEntityMetadata extends LinkedEntityMetadata, TSide extends Side> = {
    readonly applicableTypesInfo: ApplicableTypesInfo<TSide>;
    readonly onSelectLinkedEntityMetadata: (linkedEntityMetadata: TLinkedEntityMetadata) => void;
    readonly classes: {
        container: string;
        typeSelector: string;
        selectorButton: string;
        title: string;
        buttonContainer: string;
    };
};

export type LinkedEntityMetadataSelectorType<TLinkedEntityMetadata extends LinkedEntityMetadata, TSide extends Side> =
    ComponentType<Props<TLinkedEntityMetadata, TSide>>;
