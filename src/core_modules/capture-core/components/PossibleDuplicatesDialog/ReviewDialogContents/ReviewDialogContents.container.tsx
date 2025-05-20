import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import type { ReduxStore } from '../../../../../core_modules/capture-core-utils/types/global';
import { ReviewDialogContentsComponent } from './ReviewDialogContents.component';
import { withLoadingIndicator } from '../../../HOC/withLoadingIndicator';
import { withErrorMessageHandler } from '../../../HOC/withErrorMessageHandler';
import { getAttributesFromScopeId } from '../../../metaData/helpers';

const buildDataElements = (scopeId: string) => {
    const currentSearchScopeDataElements = getAttributesFromScopeId(scopeId);

    return currentSearchScopeDataElements
        .filter(({ displayInReports }: { displayInReports: boolean }) => displayInReports)
        .map(({ id, name, type }: { id: string, name: string, type: string }) => ({ id, name, type }));
};

const mapStateToProps = (
    { possibleDuplicates }: ReduxStore['value'],
    { selectedScopeId }: { selectedScopeId: string },
) => ({
    ready: !possibleDuplicates.isLoading,
    isUpdating: possibleDuplicates.isUpdating,
    error: possibleDuplicates.loadError ? i18n.t('An error occurred loading possible duplicates') : undefined,
    teis: possibleDuplicates.teis,
    dataElements: buildDataElements(selectedScopeId),
});

const mapDispatchToProps = () => ({});

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(ReviewDialogContentsComponent);
const WithLoadingIndicator = withLoadingIndicator(() => ({ padding: '100px 0' }), null, (props: any) => (!props.isUpdating && props.ready));
const LoadingComponent = WithLoadingIndicator(ConnectedComponent);
const WithErrorHandler = withErrorMessageHandler();
export const ReviewDialogContents = WithErrorHandler(LoadingComponent);
