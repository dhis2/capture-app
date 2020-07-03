// @flow
import * as React from 'react';
import withInternalFilterHandler from './withInternalFilterHandler';
import { get as getOrgUnitRoots } from '../orgUnitRoots.store';
import scopes from './scopes.const';

type Props = {
    scope: $Values<typeof scopes>,
};

// Wraps withInternalFilterHandler. Passes on defaultRoots from the organisation unit store based on the input scope.
export default () =>
    (InnerComponent: React.ComponentType<any>) => {
        const InternalFilterHandlerHOC = withInternalFilterHandler()(InnerComponent);

        class OrgUnitImplicitInternalFilterHandlerHOC extends React.Component<Props> {
            defaultRoots: Array<any>;
            constructor(props: Props) {
                super(props);
                const { scope } = this.props;
                this.defaultRoots =
                    getOrgUnitRoots(OrgUnitImplicitInternalFilterHandlerHOC.DEFAULT_ROOTS_DATA[scope]) || [];
            }
            static DEFAULT_ROOTS_DATA = {
                [scopes.USER_CAPTURE]: 'captureRoots',
                [scopes.USER_SEARCH]: 'search',
            };

            render() {
                const { ...passOnProps } = this.props;
                return (
                    // $FlowFixMe
                    <InternalFilterHandlerHOC
                        defaultRoots={this.defaultRoots}
                        {...passOnProps}
                    />
                );
            }
        }
        return OrgUnitImplicitInternalFilterHandlerHOC;
    };
