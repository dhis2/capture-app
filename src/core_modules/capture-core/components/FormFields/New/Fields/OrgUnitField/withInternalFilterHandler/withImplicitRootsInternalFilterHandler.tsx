import * as React from 'react';
import { withInternalFilterHandler } from './withInternalFilterHandler';
import { get as getOrgUnitRoots } from '../orgUnitRoots.store';
import { orgUnitFieldScopes } from './scopes.const';
import { withApiUtils } from '../../../../../../HOC';
import type { OrgUnitFieldScope } from './scopes.const';

type Props = {
    scope: OrgUnitFieldScope;
};

// Wraps withInternalFilterHandler. Passes on defaultRoots from the organisation unit store based on the input scope.
export const withOrgUnitFieldImplicitRootsFilterHandler = () =>
    <P extends Record<string, unknown>>(InnerComponent: React.ComponentType<P>) => {
        const InternalFilterHandlerHOC = withApiUtils(withInternalFilterHandler()(InnerComponent));

        class OrgUnitImplicitInternalFilterHandlerHOC extends React.Component<Props & P> {
            constructor(props: Props & P) {
                super(props);
                const { scope } = this.props;
                this.defaultRoots =
                    getOrgUnitRoots(OrgUnitImplicitInternalFilterHandlerHOC.DEFAULT_ROOTS_DATA[scope]) || [];
            }

            static DEFAULT_ROOTS_DATA = {
                [orgUnitFieldScopes.USER_CAPTURE]: 'captureRoots',
                [orgUnitFieldScopes.USER_SEARCH]: 'search',
            };

            defaultRoots: Array<any>;

            render() {
                const { ...passOnProps } = this.props;
                return (
                    <InternalFilterHandlerHOC
                        defaultRoots={this.defaultRoots}
                        {...passOnProps}
                    />
                );
            }
        }
        return OrgUnitImplicitInternalFilterHandlerHOC;
    };
