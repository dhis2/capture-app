import type { LinkedRecordClick } from '../../../../WidgetsRelationship/WidgetTrackedEntityRelationship';

export type Props = {
    trackedEntityTypeId: string;
    teiId: string;
    programId: string;
    orgUnitId: string;
    addRelationshipRenderElement: HTMLDivElement;
    onOpenAddRelationship: () => void;
    onCloseAddRelationship: () => void;
    onLinkedRecordClick: LinkedRecordClick;
    readOnly: boolean;
    readOnlyMode?: boolean;
    hideButton?: boolean;
    accessReadOnly?: boolean;
    hideReadOnlyBadge?: boolean;
};
