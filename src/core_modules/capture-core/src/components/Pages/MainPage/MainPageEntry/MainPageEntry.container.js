// @flow
import { connect } from 'react-redux';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import MainPageSelector from '../MainPageSelector/MainPageSelector.container';

const mapStateToProps = (state: ReduxState) => ({
    error: state.mainPage.selectionsError,
});


export default connect(mapStateToProps, () => ({}))(withErrorMessageHandler()(MainPageSelector));

