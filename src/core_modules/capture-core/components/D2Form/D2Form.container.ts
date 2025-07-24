import { connect } from 'react-redux';
import { compose } from 'redux';
import type { PropsFromRedux, OwnProps } from './D2Form.types';
import { withAsyncHandler } from './asyncHandlerHOC';
import { D2FormComponent } from './D2Form.component';

type ReduxState = {
    forms: { [key: string]: any };
};

const mapStateToProps = (state: ReduxState, ownProps: OwnProps): PropsFromRedux => {
    const { forms } = state;

    const isFormInReduxStore = !!forms[ownProps.id];
    return { isFormInReduxStore };
};

export const D2Form = compose(
    connect<PropsFromRedux, Record<string, never>, OwnProps, ReduxState>(mapStateToProps, () => ({})),
    withAsyncHandler(),
)(D2FormComponent);
