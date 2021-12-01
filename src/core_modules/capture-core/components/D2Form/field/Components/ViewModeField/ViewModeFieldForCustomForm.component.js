// @flow
import {
    withCustomElementContainer,
} from '../internal';
import {
    ViewModeField,
} from '../../../../FormFields/New';
import customFormStyles from './ViewModeFieldCustomForm.module.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export const ViewModeFieldForCustomForm =
withCustomElementContainer(getContainerClass)(
    ViewModeField,
);
