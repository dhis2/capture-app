// @flow
import { compose } from 'redux';
import { withSaveHandler } from '../../../../../DataEntry';
import withMainButton from './withMainButton';
import { EnrollmentRegistrationEntry } from '../../../../../DataEntries';

const SaveHandlerHOC = compose(
  withSaveHandler({
    onGetFormFoundation: (props: Object) => props.enrollmentMetadata.enrollmentForm,
  }),
  withMainButton(),
)(EnrollmentRegistrationEntry);

export default SaveHandlerHOC;
