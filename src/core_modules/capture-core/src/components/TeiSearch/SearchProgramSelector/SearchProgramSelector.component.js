// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { programCollection } from '../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../metaData';
import VirtualizedSelect from '../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import type {
    VirtualizedOptionConfig,
} from '../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { withDefaultFieldContainer, withLabel } from '../../FormFields/New';

const SearchProgramField = withDefaultFieldContainer()(withLabel()(VirtualizedSelect));

const getTrackerProgramOptions = () => Array.from(programCollection.values())
    .filter(program => program instanceof TrackerProgram && program.access.data.read)
    .map(p => ({ value: p.id, label: p.name }));

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
}
class SearchProgramSelector extends React.Component<Props> {
    programOptions: Array<VirtualizedOptionConfig>;
    constructor(props: Props) {
        super(props);
        this.programOptions = getTrackerProgramOptions();
    }

    onSelectProgram = (programId: ?string) => {
        this.props.onSetProgram(this.props.searchId, programId);
    }
    render() {
        return (
            <SearchProgramField
                styles={programFieldStyles}
                options={this.programOptions}
                onSelect={this.onSelectProgram}
                label={i18n.t('Selected program')}
                value={this.props.selectedProgramId}
            />
        );
    }
}

export default SearchProgramSelector;
