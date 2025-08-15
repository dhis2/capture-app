import type { Theme } from '@material-ui/core/styles';
import type { WithStyles } from '@material-ui/core';
import type { SearchGroup } from '../../../../../../metaData';

export const getStyles = (theme: Theme) => ({
    container: {},
    orgUnitSection: {
        backgroundColor: 'white',
        padding: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(892),
    },
    searchButtonContainer: {
        padding: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
    },
    minAttributesRequired: {
        flexGrow: 1,
        textAlign: 'right' as const,
        fontSize: theme.typography.pxToRem(14),
    },
    minAttribtuesRequiredInvalid: {
        color: theme.palette.error.main,
    },
});

export type State = {
    showMissingSearchCriteriaModal: boolean;
};

export type Props = {
    id: string;
    searchGroupId: string;
    onSearch: (formId: string, searchGroupId: string) => void;
    onSearchValidationFailed: (formId: string, SearchGroupId: string) => void;
    searchAttempted: boolean;
    searchId: string;
    searchGroup: SearchGroup;
    attributesWithValuesCount: number;
    formsValues: { [formElement: string]: any };
} & WithStyles<typeof getStyles>;
