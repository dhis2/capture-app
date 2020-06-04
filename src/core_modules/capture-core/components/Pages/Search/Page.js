// @flow
import { connect } from 'react-redux';
import SearchPageSelector from './SearchPageSelector/SearchPageSelector.container';
import withErrorMessageHandler from '../../../HOC/withErrorMessageHandler';
import withLoadingIndicator from '../../../HOC/withLoadingIndicator';

const mapStateToProps = (state: ReduxState) => ({
    error: state.searchPage.selectionsError,
    ready: !state.searchPage.isLoading,
});


const SearchPage = connect(mapStateToProps, () => ({}))(
    withLoadingIndicator()(
        withErrorMessageHandler()(SearchPageSelector),
    ));


export default SearchPage;
