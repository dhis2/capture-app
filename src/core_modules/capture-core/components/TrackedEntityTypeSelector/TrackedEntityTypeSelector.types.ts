import type { scopeTypes } from '../../metaData';

export type OwnProps = {
    accessNeeded?: 'write' | 'read';
    onSelect: (searchScopeId: string, searchScopeType: keyof typeof scopeTypes) => void;
    footerText: string;
};

export type ContainerProps = {
    onSetTrackedEntityTypeIdOnUrl: (params: { trackedEntityTypeId: string }) => void;
};

export type Props = OwnProps & ContainerProps;
