// @flow
import {
    withSaveHandler,
} from '../../../../DataEntry';
import {
    TrackedEntityInstanceDataEntry,
} from '../../../../DataEntries';
import withMainButton from './withMainButton';

const SaveHandlerHOC =
    withSaveHandler(
        { onGetFormFoundation: (props: Object) => props.teiRegistrationMetadata.form })(
        withMainButton()(TrackedEntityInstanceDataEntry));

export default SaveHandlerHOC;
