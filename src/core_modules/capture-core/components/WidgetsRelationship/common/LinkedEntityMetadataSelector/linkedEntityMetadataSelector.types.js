// @flow
import type { ComponentType } from 'react';

export type TargetSides = 'FROM' | 'TO';

export type Side = $ReadOnly<{
    name: string,
    targetSide: TargetSides,
}>;

type ApplicableTypeInfo<TSide: Side> = $ReadOnly<{
    id: string,
    name: string,
    sides: $ReadOnlyArray<TSide>,
}>;

type ApplicableTypesInfo<TSide> = $ReadOnlyArray<ApplicableTypeInfo<TSide>>;

export type LinkedEntityMetadata = $ReadOnly<{
    ...Side,
    relationshipId: string,
}>;

export type Props<TLinkedEntityMetadata: LinkedEntityMetadata, TSide: Side> = $ReadOnly<{|
    applicableTypesInfo: ApplicableTypesInfo<TSide>,
    onSelectLinkedEntityMetadata: (linkedEntityMetadata: TLinkedEntityMetadata) => void,
|}>;

export type PlainProps<TLinkedEntityMetadata: LinkedEntityMetadata, TSide: Side> = $ReadOnly<{|
    applicableTypesInfo: ApplicableTypesInfo<TSide>,
    onSelectLinkedEntityMetadata: (linkedEntityMetadata: TLinkedEntityMetadata) => void,
    ...CssClasses,
|}>;

export type LinkedEntityMetadataSelectorType<TLinkedEntityMetadata, TSide> =
    ComponentType<Props<TLinkedEntityMetadata, TSide>>;
