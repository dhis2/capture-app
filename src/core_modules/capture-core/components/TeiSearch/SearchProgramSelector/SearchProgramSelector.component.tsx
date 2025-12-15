import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { NewSingleSelectField, withDefaultFieldContainer, withLabel } from '../../FormFields/New';
import type { SearchProgramSelectorProps } from './SearchProgramSelector.types';

const SearchProgramField = withDefaultFieldContainer()(withLabel()(NewSingleSelectField));

const programFieldStyles = {
    labelContainerStyle: {
        paddingTop: 12,
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

export class SearchProgramSelectorComponent extends React.Component<SearchProgramSelectorProps> {
    onSelectProgram = ({ selected }: { selected: string }) => {
        this.props.onSetProgram(this.props.searchId, selected);
    }
    render() {
        const { programOptions, selectedProgramId } = this.props;
        return (
            <SearchProgramField
                styles={programFieldStyles}
                value={selectedProgramId}
                onChange={value => this.onSelectProgram({ selected: value || '' })}
                label={i18n.t('Selected program')}
                clearable
                filterable
                options={programOptions}
            />
        );
    }
}
