// @flow
import * as React from 'react';

type Props = {

}

type Settings = {
    getCellBody: (row: {eventId: string, [elementId: string]: any}, props: Object) => React.Node,
    getCellHeader?: ?(props: Object) => React.Node,
    headerCellStyle?: ?Object,
    bodyCellStyle?: ?Object,
}

export default (settingsFn: () => Settings) =>
    (InnerComponent: React.ComponentType<any>) =>
        class CustomEndCellHOC extends React.Component<Props> {
            getCustomEndCellBody = (row: {eventId: string, [elementId: string]: any}, props: Object) => {
                const settings = settingsFn();
                return settings.getCellBody(row, props);
            }

            getCustomEndCellHeader = (row: string, props: Object) => {
                const settings = settingsFn();
                return settings.getCellHeader && settings.getCellHeader(props);
            }

            render() {
                const settings = settingsFn();
                return (
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <InnerComponent
                        getCustomEndCellHeader={this.getCustomEndCellHeader}
                        getCustomEndCellBody={this.getCustomEndCellBody}
                        customEndCellHeaderStyle={settings.headerCellStyle}
                        customEndCellBodyStyle={settings.bodyCellStyle}
                        {...this.props}
                    />);
            }
        }
;
