// @flow
import React, { useEffect, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors } from '@dhis2/ui';
import { DebounceField } from 'capture-ui';
import { withStyles } from '@material-ui/core/styles';
import { OrgUnitTreeComponent } from './OrgUnitField.component';
import { useSearchScopeWithFallback } from './useSearchScopeWithFallback';

const styles = {
    root: {
        border: '1px solid #ccc',
        margin: '20px 0',
    },
    debounceFieldContainer: {
        padding: 8,
        background: colors.grey100,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    orgUnitTreeContainer: {
        maxHeight: 300,
        overflowY: 'auto',
        margin: '10px 0',
        padding: '0 8px',
    },
};

type Props = {
    selected: { id: string, path: Array<string> },
    onSelectClick: (Object) => void,
    classes: {
        root: string,
        debounceFieldContainer: string,
        orgUnitTreeContainer: string,
    },
};

const DefaultTreeKey = 'Initial';

export const OrgUnitFieldPlain = ({ selected, onSelectClick, classes }: Props) => {
    const [searchText, setSearchText] = useState(undefined);
    const [key, setKey] = useState(DefaultTreeKey);
    const { orgUnitRoots, isLoading } = useSearchScopeWithFallback({
        searchText,
    });

    useEffect(() => {
        if (searchText?.length) {
            setKey(`${searchText}-${new Date().getTime()}`);
            return;
        }
        setKey(DefaultTreeKey);
    }, [searchText]);

    if (isLoading) {
        return null;
    }

    const handleFilterChange = (event: SyntheticEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value);
    };

    return (
        <div className={classes.root}>
            <div className={classes.debounceFieldContainer}>
                <DebounceField
                    onDebounced={handleFilterChange}
                    value={searchText}
                    placeholder={i18n.t('Search')}
                    classes={classes}
                />
            </div>
            <div className={classes.orgUnitTreeContainer}>
                <OrgUnitTreeComponent
                    treeKey={searchText ? key : DefaultTreeKey}
                    roots={orgUnitRoots}
                    selected={selected}
                    onSelectClick={onSelectClick}
                />
            </div>
        </div>
    );
};

export const OrgUnitField = withStyles(styles)(OrgUnitFieldPlain);
