// @flow
import { connect } from 'react-redux';
import { DATA_ENTRY_ID, DATA_ENTRY_KEY } from 'capture-core/constants';
import {
    startGoBackToMainPage,
} from './viewEvent.actions';
import { ViewEventComponent } from './ViewEvent.component';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';

import { withErrorMessageHandler } from '../../../../HOC/withErrorMessageHandler';
import { makeProgramStageSelector, makeEventAccessSelector } from './viewEvent.selectors';


const makeMapStateToProps = () => {
    const programStageSelector = makeProgramStageSelector();
    const eventAccessSelector = makeEventAccessSelector();

    // $FlowFixMe[not-an-object] automated comment
    return (state: ReduxState) => {
        const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
        return {
            programStage: programStageSelector(state),
            eventAccess: eventAccessSelector(state),
            error: state.viewEventPage.loadError,
            currentDataEntryKey: eventDetailsSection.showEditEvent
                ? getDataEntryKey(DATA_ENTRY_ID.singleEvent, DATA_ENTRY_KEY.edit)
                : getDataEntryKey(DATA_ENTRY_ID.singleEvent, DATA_ENTRY_KEY.view),
        };
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onBackToAllEvents: () => {
        dispatch(startGoBackToMainPage());
    },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const ViewEvent = connect(makeMapStateToProps, mapDispatchToProps)(
    withErrorMessageHandler()(ViewEventComponent),
);
