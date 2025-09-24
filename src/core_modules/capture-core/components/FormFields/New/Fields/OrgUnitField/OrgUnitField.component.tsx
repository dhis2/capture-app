import { colors } from '@dhis2/ui';
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDataQuery } from '@dhis2/app-runtime';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { DebounceField } from 'capture-ui';
import { OrgUnitTree } from './OrgUnitTree.component';

const getStyles = () => ({
    container: {
        border: '1px solid',
        borderColor: colors.grey300,
        borderRadius: '3px',
        height: '100%',
        width: '100%',
        zIndex: 0,
        backgroundColor: 'white',
    },
    searchField: {
        height: '40px',
        overflow: 'hidden',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxShadow: 'none',
        border: 'none',
    },
    debounceFieldContainer: {
        padding: 8,
        background: colors.grey100,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    orgUnitTreeContainer: {
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        overflow: 'auto',
    },
});

type OrgUnitFieldProps = {
    onSelectClick: (selectedOrgUnit: any) => void;
    onBlur: (selectedOrgUnit: any) => void;
    selected?: string;
    maxTreeHeight?: number;
    disabled?: boolean;
    previousOrgUnitId?: string;
    dataTest?: string;
};

type Props = OrgUnitFieldProps & WithStyles<typeof getStyles>;

const OrgUnitFieldPlain = (props: Props) => {
    const {
        onSelectClick,
        onBlur,
        classes,
        selected,
        maxTreeHeight,
        disabled,
        previousOrgUnitId,
        dataTest,
    } = props;
    const [searchText, setSearchText] = React.useState<string | undefined>(undefined);
    const [key, setKey] = React.useState<string | undefined>(undefined);

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
            setKey(`${searchText}-${new Date().getTime()}`);
        }
    }, [refetchOrg, searchText]);

    const renderOrgUnitTree = () => {
        if (searchText?.length) {
            return (<OrgUnitTree
                roots={(searchData?.orgUnits as any)?.organisationUnits || []}
                onSelectClick={onSelectClick}
                ready={ready}
                treeKey={key}
                selected={selected}
            />);
        }
        return (<OrgUnitTree
            roots={(data?.orgUnits as any)?.organisationUnits}
            onSelectClick={onSelectClick}
            ready={ready}
            treeKey={'initial'}
            selected={selected}
            previousOrgUnitId={previousOrgUnitId}
        />);
    };

    const handleFilterChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value);
    };

    const handleBlur = () => {
        onBlur && onBlur(null);
    };


    const styles = maxTreeHeight ? { maxHeight: maxTreeHeight, overflowY: 'auto' as const } : undefined;
    return (
        <div
            className={classes.container}
            onBlur={handleBlur}
        >
            <div className={classes.debounceFieldContainer}>
                <DebounceField
                    onDebounced={handleFilterChange}
                    value={searchText}
                    placeholder={i18n.t('Search')}
                    classes={classes}
                    disabled={disabled}
                    dataTest={dataTest}
                />
            </div>
            {!disabled &&
            <div className={classes.orgUnitTreeContainer} style={styles}>
                {renderOrgUnitTree()}
            </div>
            }
        </div>
    );
};

export const OrgUnitField = withStyles(getStyles)(OrgUnitFieldPlain);
