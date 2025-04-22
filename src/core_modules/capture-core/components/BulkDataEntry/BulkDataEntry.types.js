// @flow
import { bulkDataEntryBreadcrumbsKeys } from '../Breadcrumbs/BulkDataEntryBreadcrumb';

export type Props = {
    programId: string,
    page: $Values<typeof bulkDataEntryBreadcrumbsKeys>,
    setShowBulkDataEntryPlugin: (show: boolean) => void,
    setBulkDataEntryTrackedEntities: (trackedEntities: Array<string> | null) => void,
    displayFrontPageList?: boolean,
    trackedEntityName?: string,
    trackedEntities?: Array<string>,
    ...CssClasses,
};
