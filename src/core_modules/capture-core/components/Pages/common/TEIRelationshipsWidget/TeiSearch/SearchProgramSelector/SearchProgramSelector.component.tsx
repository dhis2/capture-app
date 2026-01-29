import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { SingleSelectField } from '../../../../../FormFields/New/Fields/SingleSelectField/SingleSelectField.component';
import { withDefaultFieldContainer, withLabel } from '../../../../../FormFields/New';

const SearchProgramField = withDefaultFieldContainer()(withLabel()(SingleSelectField));

const programFieldStyles = {
    labelContainerStyle: {
        paddingTop: 12,
        flexBasis: 200,
    },
};

type Props = {
    searchId: string;
    selectedProgramId?: string;
    onSetProgram: (searchId: string, programId?: string) => void;
    programOptions: Array<{ label: string; value: string }>;
};

export class SearchProgramSelectorComponent extends React.Component<Props> {
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
