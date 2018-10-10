// @flow
import OrgUnitTree from '../../../../FormFields/OrgUnitTree/OrgUnitTree.component';
import {
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withCalculateMessages,
    withDisplayMessages,
    withInternalChangeHandler,
} from '../../../../FormFields/New';
import withRequiredFieldCalculation from '../../withRequiredFieldCalculation';
import withCustomElementContainer from '../../withCustomElementContainer';

export default withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
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
