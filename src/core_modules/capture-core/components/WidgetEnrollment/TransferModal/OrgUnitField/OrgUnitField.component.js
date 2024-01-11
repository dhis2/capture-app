// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { colors, OrganisationUnitTree } from '@dhis2/ui';
import { useApiMetadataQuery } from '../../../../utils/reactQueryHelpers';
import type { Props } from './OrgUnitField.types';
import { DebounceField } from '../../../../../capture-ui';

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

export const OrgUnitFieldPlain = ({ onSelect, selectedOrgUnit, classes }: Props) => {
    const [searchQuery, setSearchQuery] = useState();

    const { data: searchOrgUnits, isLoading } = useApiMetadataQuery(
        ['organisationUnits', 'searchScope'],
        {
            resource: 'me',
            params: {
                fields: 'teiSearchOrganisationUnits[id,displayName,path]',
            },
        },
        {
            select: ({ teiSearchOrganisationUnits }) => teiSearchOrganisationUnits.map(orgUnit => orgUnit.id),
        },
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const selectedPath = [selectedOrgUnit?.path];
    console.log('selectedPath', selectedPath);
    return (
        <>
            <div className={classes.root}>
                <div className={classes.debounceFieldContainer}>
                    <DebounceField
                        value={searchQuery}
                        onDebounced={event => setSearchQuery(event.currentTarget.value)}
                        placeholder={i18n.t('Search for an organisation unit')}
                    />
                </div>
                <div className={classes.orgUnitTreeContainer}>
                    <OrganisationUnitTree
                        roots={searchOrgUnits}
                        selected={selectedOrgUnit ? [selectedOrgUnit?.path] : []}
                        singleSelection
                        onChange={orgUnit => onSelect(orgUnit)}
                    />
                </div>
            </div>
        </>
    );
};

export const OrgUnitField = withStyles(styles)(OrgUnitFieldPlain);
