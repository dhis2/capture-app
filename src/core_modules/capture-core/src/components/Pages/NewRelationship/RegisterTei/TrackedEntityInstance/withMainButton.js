// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button } from 'capture-ui';

type Props = {
    onSave: () => void,
};

const getMainButton = (InnerComponent: React.ComponentType<any>) =>
    class MainButtonHOC extends React.Component<Props> {
        static getButtonText() {
            return i18n.t('Create person and link');
        }

        renderButton() {
            const { onSave } = this.props;

            return (
                <Button
                    kind="primary"
                    size="medium"
                    onClick={onSave}
                >
                    {MainButtonHOC.getButtonText()}
                </Button>
            );
        }

        render() {
            const {
                onSave,
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

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps, null, { withRef: true })(getMainButton(InnerComponent));
