import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    OptionsSelectVirtualized,
} from '../../../../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { withDefaultFieldContainer, withLabel } from '../../../../../FormFields/New';

const SearchProgramField = withDefaultFieldContainer()(withLabel()(OptionsSelectVirtualized));

const programFieldStyles = {
    labelContainerStyle: {
        paddingTop: 12,
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

export class SearchProgramSelectorComponent extends React.Component {
    onSelectProgram = (programId) => {
        this.props.onSetProgram(this.props.searchId, programId);
    }
    render() {
        return (
            <SearchProgramField
                styles={programFieldStyles}
                options={this.props.programOptions}
                onSelect={this.onSelectProgram}
                label={i18n.t('Selected program')}
                value={this.props.selectedProgramId}
            />
        );
    }
}
