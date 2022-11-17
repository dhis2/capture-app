// @flow
import {
    withHideCompatibility,
    ViewModeField,
} from '../../../../FormFields/New';
import {
    withCustomElementContainer,
} from '../internal';
import customFormStyles from './ViewModeFieldCustomForm.module.css';

const getContainerClass = () => customFormStyles.defaultCustomContainer;

export const ViewModeFieldForCustomForm =
withHideCompatibility()(
    withCustomElementContainer(getContainerClass)(
        ViewModeField,
    ),
);
