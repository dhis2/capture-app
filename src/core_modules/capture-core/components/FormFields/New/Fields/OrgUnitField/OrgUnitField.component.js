// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDataQuery } from '@dhis2/app-runtime';
import { withStyles } from '@material-ui/core/styles';
import { DebounceField } from 'capture-ui';
import { OrgUnitTree } from './OrgUnitTree.component';

const getStyles = () => ({
    container: {
        border: '1px solid #C4C4C4',
        borderRadius: '3px',
        height: '100%',
        width: '100%',
        boxShadow: '0px 0px 2px 0px #C4C4C4 inset',
        zIndex: 0,
        backgroundColor: 'white',
    },
    searchField: {
        height: '40px',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxShadow: 'none',
        border: 'none',
    },
    debounceFieldContainer: {
        paddingBottom: 0,
    },
    orgUnitTreeContainer: {
        padding: 2,
        borderTop: '1px solid #C4C4C4',
        overflow: 'auto',
    },
});

type Props = {
    onSelectClick: (selectedOrgUnit: Object) => void,
    ready?: ?boolean,
    selected?: ?string,
    maxTreeHeight?: ?number,
    disabled?: ?boolean,
    classes: {
        outerContainer: string,
        container: string,
        searchField: string,
        debounceFieldContainer: string,
        orgUnitTreeContainer: string,
    },
};

const OrgUnitFieldPlain = (props: Props) => {
    const {
        onSelectClick,
        classes,
        selected,
        maxTreeHeight,
        disabled,
    } = props;
    const [searchText, setSearchText] = React.useState(undefined);

    const { loading, data } = useDataQuery(
        React.useMemo(
            () => ({
                orgUnits: {
                    resource: 'me',
                    params: {
                        fields: ['organisationUnits[id,path]'],
                    },

                },
            }),
            [],
        ),
    );


    const { loading: searchLoading, data: searchData, refetch: refetchOrg } = useDataQuery(
        React.useMemo(
            () => ({
                orgUnits: {
                    resource: 'organisationUnits',
                    params: ({ variables: { searchText: currentSearchText } }) => ({
                        fields: [
                            'id,displayName,path,publicAccess,access,lastUpdated',
                            'children[id,displayName,publicAccess,access,path,children::isNotEmpty]',
                        ].join(','),
                        paging: true,
                        query: currentSearchText,
                        withinUserSearchHierarchy: true,
                        pageSize: 15,
                    }),

                },
            }),
            [],
        ),
        { lazy: true },
    );

    const ready = searchText?.length ? !searchLoading : !loading;

    React.useEffect(() => {
        if (searchText?.length) {
            refetchOrg({ variables: { searchText } });
        }
    }, [refetchOrg, searchText]);

    const getRoots = React.useMemo(() => {
        if (searchText?.length && !searchLoading && searchData?.orgUnits) {
            return searchData?.orgUnits?.organisationUnits;
        }
        if (!loading) {
            return data?.orgUnits?.organisationUnits;
        }
        return undefined;
    }, [searchText, data, searchData, loading, searchLoading]);

    const handleFilterChange = (event: SyntheticEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value);
    };

    const styles = maxTreeHeight ? { maxHeight: maxTreeHeight, overflowY: 'auto' } : null;
    return (
        <div
            className={classes.container}
        >
            <div className={classes.debounceFieldContainer}>
                <DebounceField
                    onDebounced={handleFilterChange}
                    value={searchText}
                    placeholder={i18n.t('Search')}
                    classes={classes}
                    disabled={disabled}
                />
            </div>
            {!disabled &&
            <div className={classes.orgUnitTreeContainer} style={styles}>
                <OrgUnitTree
                    roots={getRoots}
                    onSelectClick={onSelectClick}
                    ready={ready}
                    treeKey={searchText ?? 'initial'}
                    selected={selected}
                />
            </div>
            }
        </div>
    );
};

export const OrgUnitField = withStyles(getStyles)(OrgUnitFieldPlain);
