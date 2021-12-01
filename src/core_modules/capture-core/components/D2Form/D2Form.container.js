// @flow
import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withAsyncHandler } from './asyncHandlerHOC';
import { D2FormComponent } from './D2Form.component';
import type { Props, PropsFromRedux, OwnProps } from './D2Form.types';

const mapStateToProps = (state: ReduxState, ownProps: OwnProps): PropsFromRedux => {
    const { forms } = state;

    const isFormInReduxStore = !!forms[ownProps.id];
    return { isFormInReduxStore };
};

export const D2Form: ComponentType<OwnProps> =
  compose(
      connect<$Diff<Props, CssClasses>, OwnProps, _, _, _, _>(mapStateToProps, () => ({})),
      withAsyncHandler(),
  )(D2FormComponent);
