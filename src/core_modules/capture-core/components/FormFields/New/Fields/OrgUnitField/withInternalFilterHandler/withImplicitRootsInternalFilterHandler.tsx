import * as React from 'react';
import { withInternalFilterHandler } from './withInternalFilterHandler';
import { get as getOrgUnitRoots } from '../orgUnitRoots.store';
import { orgUnitFieldScopes } from './scopes.const';
import { withApiUtils } from '../../../../../../HOC';
import type { OrgUnitFieldScope } from './scopes.const';

type WithImplicitRootsProps = {
    scope: OrgUnitFieldScope;
};

export const withOrgUnitFieldImplicitRootsFilterHandler = () =>
    <T extends Record<string, any>>(InnerComponent: React.ComponentType<T>) => {
        const InternalFilterHandlerHOC = withApiUtils(withInternalFilterHandler()(InnerComponent));

        class OrgUnitImplicitInternalFilterHandlerHOC extends React.Component<WithImplicitRootsProps & T> {
            constructor(props: WithImplicitRootsProps & T) {
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
                        {...(passOnProps as T)}
                    />
                );
            }
        }
        return OrgUnitImplicitInternalFilterHandlerHOC;
    };
