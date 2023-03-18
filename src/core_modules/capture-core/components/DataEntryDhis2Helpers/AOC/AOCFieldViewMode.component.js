// @flow
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { CategoryOption } from '../../FormFields/New/CategoryOptions/CategoryOptions.types';
import { useCategoryCombinations } from './useCategoryCombinations';
import { Section } from '../../Section/Section.component';
import { SectionHeaderSimple } from '../../Section';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { getCachedSingleResourceFromKeyAsync } from '../../../MetaDataStoreUtils/MetaDataStoreUtils';
import { userStores } from '../../../storageControllers/stores';

const getStyles = () => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        padding: `${spacers.dp8} ${spacers.dp8} ${spacers.dp8} ${spacers.dp12}`,
    },
    label: {
        flexBasis: 200,
        paddingLeft: 5,
    },
    field: {
        fontWeight: 500,
    },
});

type Props = {
    categories: Array<CategoryOption>,
    selectedCategories?: ?{[categoryId: string]: CategoryOption },
    ...CssClasses
};

const attributeOptionsKey = 'attributeCategoryOptions';
const AOCFieldViewModePlain = (props: Props) => {
    const { id: dataEntryId, itemId, programId, classes } = props;
    const { programCategory } = useCategoryCombinations(programId);
    const [selectedCategories, setSelectedCategories] = useState({});
    const { categories, displayName } = programCategory || {};
    const formId = getDataEntryKey(dataEntryId, itemId);
    const fieldsValue = useSelector(({ dataEntriesFieldsValue }) => dataEntriesFieldsValue[formId]);
    const categoryOptions = useMemo(() => Object.keys(fieldsValue)
        .filter(key => key.startsWith(`${attributeOptionsKey}-`))
        .map(key => fieldsValue[key]), [fieldsValue]);

    useEffect(() => {
        if (categoryOptions.length) {
            Promise.all(categoryOptions.map(optionId =>
                getCachedSingleResourceFromKeyAsync(userStores.CATEGORY_OPTIONS, optionId)),
            ).then((optionResults) => {
                optionResults.forEach(({ response }) => {
                    setSelectedCategories(prevCategories => ({
                        ...prevCategories,
                        [response.categories[0]]: { id: response.id, displayName: response.displayName },
                    }));
                });
            });
        }
    }, [categoryOptions]);

    return (
        <div className={classes.wrapper}>
            <Section
                header={
                    <SectionHeaderSimple
                        title={displayName}
                    />
                }
            >
                { categories.map(category => (
                    <div className={classes.container}>
                        <div className={classes.label}>
                            {category.displayName}
                        </div>
                        <div className={classes.field}>
                            {selectedCategories?.[category.id]?.displayName}
                        </div>
                    </div>
                ))}
            </Section>
        </div>
    );
};

export const AOCFieldViewMode = withStyles(getStyles)(AOCFieldViewModePlain);
