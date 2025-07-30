// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui';
import { withDefaultFieldContainer, withLabel } from '../../FormFields/New';

const SearchProgramField = withDefaultFieldContainer()(withLabel()(SingleSelectField));

const programFieldStyles = {
    labelContainerStyle: {
        paddingTop: 12,
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

type Props = {
    searchId: string,
    selectedProgramId: ?string,
    onSetProgram: (searchId: string, programId: ?string) => void,
    programOptions: Array<{value: string, label: string}>,
}
export class SearchProgramSelectorComponent extends React.Component<Props> {
    onSelectProgram = ({ selected }: { selected: string }) => {
        this.props.onSetProgram(this.props.searchId, selected);
    }
    render() {
        const { programOptions, selectedProgramId } = this.props;
        return (
            <SearchProgramField
                styles={programFieldStyles}
                selected={selectedProgramId}
                onChange={this.onSelectProgram}
                label={i18n.t('Selected program')}
                clearable
                filterable
            >
                {programOptions.map(option => (
                    <SingleSelectOption
                        key={option.value}
                        label={option.label}
                        value={option.value}
                    />
                ))}
            </SearchProgramField>
        );
    }
}
