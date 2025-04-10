import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { createStyles, withStyles } from '@material-ui/core/styles';
import {
    OptionsSelectVirtualized,
    type VirtualizedOptionConfig,
} from '../../../../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { withDefaultFieldContainer, withLabel } from '../../../../../FormFields/New';

const styles = createStyles({
    container: {
        display: 'flex',
    },
    labelContainer: {
        paddingTop: 12,
        flexBasis: 200,
    },
    inputContainer: {
        flexBasis: 150,
    },
});

const SearchProgramField = withDefaultFieldContainer()(withLabel()(OptionsSelectVirtualized));

type Props = {
    searchId: string;
    selectedProgramId: string | null;
    onSetProgram: (searchId: string, programId: string | null) => void;
    programOptions: Array<VirtualizedOptionConfig>;
}

class SearchProgramSelectorPlain extends React.Component<Props> {
    onSelectProgram = (programId: string | null) => {
        this.props.onSetProgram(this.props.searchId, programId);
    }

    render() {
        return (
            <SearchProgramField
                options={this.props.programOptions}
                onSelect={this.onSelectProgram}
                label={i18n.t('Selected program')}
                value={this.props.selectedProgramId}
            />
        );
    }
}

export const SearchProgramSelectorComponent = withStyles(styles)(SearchProgramSelectorPlain);
