// @flow
import {
    ViewModeField,
} from '../../../../FormFields/New';
import {
    withCustomElementContainer,
} from '../internal';
import customFormStyles from './ViewModeFieldCustomForm.mod.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export default
withCustomElementContainer(getContainerClass)(
    ViewModeField,
);
