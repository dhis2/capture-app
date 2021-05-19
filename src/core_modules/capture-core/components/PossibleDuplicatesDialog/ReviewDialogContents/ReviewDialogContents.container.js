// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import i18n from '@dhis2/d2-i18n';
import { ReviewDialogContentsComponent } from './ReviewDialogContents.component';
import { withLoadingIndicator } from '../../../HOC/withLoadingIndicator';
import { withErrorMessageHandler } from '../../../HOC/withErrorMessageHandler';
import type { Props, OwnProps } from './ReviewDialogContents.types';
import { getAttributesFromScopeId } from '../../../metaData/helpers';

const buildDataElements = (scopeId) => {
    const currentSearchScopeDataElements = getAttributesFromScopeId(scopeId);

    return currentSearchScopeDataElements
        .filter(({ displayInReports }) => displayInReports)
        .map(({ id, name, type }) => ({ id, name, type }));
};

const mapStateToProps = (
    { possibleDuplicates }: ReduxState,
    { selectedScopeId }: Object,
) => ({
    ready: !possibleDuplicates.isLoading,
    isUpdating: possibleDuplicates.isUpdating,
    error: possibleDuplicates.loadError ? i18n.t('An error occurred loading possible duplicates') : null,
    teis: possibleDuplicates.teis,
    dataElements: buildDataElements(selectedScopeId),
});

const mapDispatchToProps = () => ({});

export const ReviewDialogContents: ComponentType<OwnProps> =
  compose(
      connect<$Diff<Props, CssClasses>, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps),
      withLoadingIndicator(() => ({ padding: '100px 0' }), null, props => (!props.isUpdating && props.ready)),
      withErrorMessageHandler(),
  )(ReviewDialogContentsComponent);
