// @flow
import { connect } from 'react-redux';
import { compose } from 'redux';
import i18n from '@dhis2/d2-i18n';
import { ReviewDialogContentsComponent } from './ReviewDialogContents.component';
import withLoadingIndicator from '../../../../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../../../../HOC/withErrorMessageHandler';
import { makeDataElementsSelector } from './reviewDialogContents.selectors';
import type { CardDataElementsInformation, SearchResultItem } from '../../../../../Search/SearchResults/SearchResults.types';

type OwnProps = {|
    onLink: (id: string, values: any)=>void
|}

type PropsFromRedux = {|
    ready: boolean,
    isUpdating: boolean,
    error: string,
    teis: Array<SearchResultItem>,
    dataElements: CardDataElementsInformation,

|}

export type Props = {| ...OwnProps, ...PropsFromRedux, ...CssClasses |}

const makeMapStateToProps = () => {
    const dataElementsSelector = makeDataElementsSelector();
    const mapStateToProps = (state: ReduxState, props: Object) => ({
        currentProgramId: state.newRelationshipRegisterTei.programId,
        ready: !state.newRelationshipRegisterTeiDuplicatesReview.isLoading,
        isUpdating: state.newRelationshipRegisterTeiDuplicatesReview.isUpdating,
        error: state.newRelationshipRegisterTeiDuplicatesReview.loadError ?
            i18n.t('An error occured loading possible duplicates') : null,
        teis: state.newRelationshipRegisterTeiDuplicatesReview.teis,
        dataElements: dataElementsSelector(state, props),
    });
    // $FlowFixMe
    return mapStateToProps;
};

const mapDispatchToProps = () => ({
});

export const ReviewDialogContents =
  compose(
      connect<Props, OwnProps, _, _, _, _>(makeMapStateToProps, mapDispatchToProps),
      withLoadingIndicator(() => ({ padding: '100px 0' }), null, props => (!props.isUpdating && props.ready)),
      withErrorMessageHandler(),
  )(ReviewDialogContentsComponent);
