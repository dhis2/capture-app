// @flow
import {
    withSaveHandler,
    withDataEntryField,
} from '../../../../DataEntry';
import {
    EnrollmentDataEntry,
} from '../../../../DataEntries';
import withMainButton from './withMainButton';
import getProgramSelectorConfig from './fieldConfigs/programSelector';

const programSelectorHOC = withDataEntryField(getProgramSelectorConfig())(EnrollmentDataEntry);
const SaveHandlerHOC =
    withSaveHandler(
        { onGetFormFoundation: (props: Object) => props.enrollmentMetadata.enrollmentForm })(
        withMainButton()(programSelectorHOC));

export default SaveHandlerHOC;
