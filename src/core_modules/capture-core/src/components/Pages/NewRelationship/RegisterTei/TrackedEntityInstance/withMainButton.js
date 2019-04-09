// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button } from 'capture-ui';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';

type Props = {
    onSave: () => void,
    possibleDuplicatesFound: boolean,
};

const getMainButton = (InnerComponent: React.ComponentType<any>) =>
    class MainButtonHOC extends React.Component<Props> {
        static getButtonText(duplicatesFound: boolean) {
            return duplicatesFound ? i18n.t('Review Duplicates') : i18n.t('Create person and link');
        }

        renderButton() {
            const { onSave, possibleDuplicatesFound } = this.props;

            return (
                <Button
                    kind="primary"
                    size="medium"
                    onClick={onSave}
                >
                    {MainButtonHOC.getButtonText(possibleDuplicatesFound)}
                </Button>
            );
        }

        render() {
            const {
                onSave,
                possibleDuplicatesFound,
                ...passOnProps
            } = this.props;
            const mainButton = this.renderButton();
            return (
                <InnerComponent
                    mainButton={mainButton}
                    {...passOnProps}
                />
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: {id: string}) => {
    const dataEntryId = props.id;
    const dataEntryKey = getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId);

    return {
        possibleDuplicatesFound: !!(state.dataEntriesSearchGroupsResults[dataEntryKey] &&
            state.dataEntriesSearchGroupsResults[dataEntryKey].main &&
            state.dataEntriesSearchGroupsResults[dataEntryKey].main.count),
    };
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps, null, { withRef: true })(getMainButton(InnerComponent));
