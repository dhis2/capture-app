// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import getDataEntryKey from '../common/getDataEntryKey';
import withInfoWidget from './withInfoWidget';

type Props = {
    feedbackItems: Array<any>,

};

const getFeedbackWidget = () =>
    class FeedbackWidgetBuilder extends React.Component<Props> {
        renderFeedbackItems = (feedbackItems: any) =>
            (<div>
                {feedbackItems.displayTexts &&
                    feedbackItems.displayTexts.map(item => (<div key={item}>{item}</div>))}
            </div>)

        render = () => {
            const { feedbackItems } = this.props;
            return (
                <div>
                    {feedbackItems && this.renderFeedbackItems(feedbackItems)}
                </div>
            );
        }
    };


const mapStateToProps = (state: ReduxState, props: any) => {
    const itemId = state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        feedbackItems: state.rulesEffectsFeedback && state.rulesEffectsFeedback[key] ?
            state.rulesEffectsFeedback[key] : null,
    };
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        withInfoWidget()(InnerComponent, connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(getFeedbackWidget()));
