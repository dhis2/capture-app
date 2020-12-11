// @flow
import { connect } from 'react-redux';
import type { ComponentType } from 'react';
import { compose } from 'redux';
import type { Props, PropsFromRedux, OwnProps } from './D2Form.types';
import { withAsyncHandler } from './asyncHandlerHOC';
import { D2FormComponent } from './D2Form.component';

const mapStateToProps = (state: ReduxState, ownProps: OwnProps): PropsFromRedux => {
  const { forms } = state;

  const isFormInReduxStore = !!forms[ownProps.id];
  return { isFormInReduxStore };
};

export const D2Form: ComponentType<OwnProps> = compose(
  connect<$Diff<Props, CssClasses>, OwnProps, _, _, _, _>(mapStateToProps, () => ({})),
  withAsyncHandler(),
)(D2FormComponent);
