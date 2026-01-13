import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { SingleSelectField, withDefaultFieldContainer, withLabel } from '../../FormFields/New';
import type { SearchProgramSelectorProps } from './SearchProgramSelector.types';

const SearchProgramField = withDefaultFieldContainer()(withLabel()(SingleSelectField));

const programFieldStyles = {
    labelContainerStyle: {
        paddingTop: 12,
        flexBasis: 200,
    },
};

export class SearchProgramSelectorComponent extends React.Component<SearchProgramSelectorProps> {
    onSelectProgram = (programId: string | null) => {
        this.props.onSetProgram(this.props.searchId, programId ?? undefined);
    }
    render() {
        return (
            <SearchProgramField
                styles={programFieldStyles}
                options={this.props.programOptions}
                onChange={this.onSelectProgram}
                label={i18n.t('Selected program')}
                value={this.props.selectedProgramId}
            />
        );
    }
}
