// @flow
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
    withCustomElementContainer,
} from '../internal';
import { OrgUnitTree } from '../../../../FormFields/OrgUnitTree/OrgUnitTree.component';
import {
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withCalculateMessages,
    withDisplayMessages,
    withInternalChangeHandler,
} from '../../../../FormFields/New';

export const OrgUnitFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withDisabledFieldCalculation()(
                withRequiredFieldCalculation()(
                    withCalculateMessages()(
                        withDisplayMessages()(
                            withCustomElementContainer()(
                                withInternalChangeHandler()(
                                    OrgUnitTree,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
