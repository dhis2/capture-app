// @flow
import {
    ViewModeField,
} from '../../../../FormFields/New';
import {
    withCustomElementContainer,
} from '../internal';
import customFormStyles from './ViewModeFieldCustomForm.module.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export const ViewModeFieldForCustomForm =
withCustomElementContainer(getContainerClass)(
    ViewModeField,
);
