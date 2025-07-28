import * as React from 'react';
import log from 'loglevel';
import { makeCancelablePromise, errorCreator } from 'capture-core-utils';
import { orgUnitFieldScopes } from './scopes.const';
import type { QuerySingleResource } from '../../../../../../utils/api/api.types';
import type { OrgUnitFieldScope } from './scopes.const';

type WithInternalFilterHandlerProps = {
    defaultRoots: Array<any>;
    scope: OrgUnitFieldScope;
    onSearchError?: (message: string) => void;
    onSelect: (value: any) => void;
    querySingleResource: QuerySingleResource;
};

type WithInternalFilterHandlerState = {
    filteredRoots: Array<any> | null;
    filterText: string | null;
    inProgress: boolean;
    treeKey: string;
};

export const withInternalFilterHandler = () =>
    <T extends Record<string, any>>(InnerComponent: React.ComponentType<T>) =>
        class OrgUnitInternalFilterHandlerHOC extends React.Component<WithInternalFilterHandlerProps & T, WithInternalFilterHandlerState> {
            constructor(props: WithInternalFilterHandlerProps & T) {
                super(props);
                this.state = {
                    filteredRoots: null,
                    filterText: null,
                    inProgress: false,
                    treeKey: 'initial',
                };
                this.cancelablePromise = null;
            }

            componentWillUnmount() {
                if (this.cancelablePromise) {
                    this.cancelablePromise.cancel();
                }
            }

            static INITIAL_TREE_KEY = 'initial';

            cancelablePromise: any;

            filterOrgUnits(filterText: string) {
                const { scope, onSearchError, querySingleResource } = this.props;
                const hierarchyProp =
                    scope === orgUnitFieldScopes.USER_CAPTURE ? { withinUserHierarchy: true } : { withinUserSearchHierarchy: true };
                this.setState({
                    inProgress: true,
                });

                if (this.cancelablePromise) {
                    this.cancelablePromise.cancel();
                }

                const cancelablePromise = makeCancelablePromise(
                    querySingleResource({
                        resource: 'organisationUnits',
                        params: {
                            fields: [
                                'id,displayName,path,publicAccess,access,lastUpdated',
                                'children[id,displayName,publicAccess,access,path,children::isNotEmpty]',
                            ].join(','),
                            paging: false,
                            query: filterText,
                            ...hierarchyProp,
                        },
                    }),
                );

                cancelablePromise
                    .promise
                    .then((orgUnitCollection: Record<string, any>) => {
                        this.setState({
                            filteredRoots: orgUnitCollection.toArray(),
                            filterText,
                            inProgress: false,
                            treeKey: filterText,
                        });
                        this.cancelablePromise = null;
                    })
                    .catch((error) => {
                        log.error(errorCreator('There was an error retrieving organisation unit roots')({ error }));
                        onSearchError && onSearchError(error);
                    });

                this.cancelablePromise = cancelablePromise;
            }

            resetOrgUnits() {
                this.setState({
                    filteredRoots: null,
                    filterText: null,
                    treeKey: OrgUnitInternalFilterHandlerHOC.INITIAL_TREE_KEY,
                });
            }

            handleFilterChange = (searchText: string) => {
                if (searchText) {
                    this.filterOrgUnits(searchText);
                } else {
                    this.resetOrgUnits();
                }
            }

            render() {
                const { defaultRoots, onSearchError, onSelect, scope, ...passOnProps } = this.props;
                const { filteredRoots, filterText, treeKey, inProgress } = this.state;
                return (
                    <InnerComponent
                        roots={filteredRoots || defaultRoots}
                        treeKey={treeKey}
                        searchText={filterText}
                        ready={!inProgress}
                        onSearch={this.handleFilterChange}
                        onBlur={onSelect}
                        {...(passOnProps as T)}
                    />
                );
            }
        };
