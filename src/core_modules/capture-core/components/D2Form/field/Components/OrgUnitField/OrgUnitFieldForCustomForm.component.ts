import { OrgUnitTree } from '../../../../FormFields/OrgUnitTree/OrgUnitTree.component';
import {
    withGotoInterface,
    withHideCompatibility,
    withCalculateMessages,
    withDisplayMessages,
    withInternalChangeHandler,
} from '../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
    withCustomElementContainer,
} from '../internal';

export const OrgUnitFieldForCustomForm = withGotoInterface()(
    withHideCompatibility()(
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
);
