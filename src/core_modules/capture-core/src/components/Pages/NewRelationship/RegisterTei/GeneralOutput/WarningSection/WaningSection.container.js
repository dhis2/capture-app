// @flow
import { connect } from 'react-redux';
import WarningsSection from '../../../../ViewEvent/RightColumn/WarningsSection/WarningsSection.component';
import { makeGetSearchGroupWarning, makeGetWarningMessages } from './warningSection.selectors';

const makeStateToProps = () => {
    const getSearchGroupWarning = makeGetSearchGroupWarning();
    const getWarningMessages = makeGetWarningMessages();
    const mapStateToProps = (state: ReduxState, props: Object) => {
        const searchGroupWarning = getSearchGroupWarning(state, props);
        return {
            warnings: getWarningMessages(state, props, searchGroupWarning),
        };
    };
    return mapStateToProps;
};

// $FlowSuppress
export default connect(makeStateToProps, () => ({}))(WarningsSection);
