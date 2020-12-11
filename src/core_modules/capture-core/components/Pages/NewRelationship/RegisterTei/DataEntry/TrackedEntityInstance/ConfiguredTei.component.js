// @flow
import { compose } from 'redux';
import { withSaveHandler } from '../../../../../DataEntry';
import withMainButton from './withMainButton';
import { TeiRegistrationEntry } from '../../../../../DataEntries';

const SaveHandlerHOC = compose(
  withSaveHandler({
    onGetFormFoundation: (props: Object) => props.teiRegistrationMetadata.form,
  }),
  withMainButton(),
)(TeiRegistrationEntry);

export default SaveHandlerHOC;
