// @flow
import * as React from 'react';

type Props = {
    name: string,
    id: string,
    orgUnitId: string,
    linkProgramId?: ?string,
};

export class TrackedEntityInstance extends React.Component<Props> {
    getUrl() {
        const { id, orgUnitId, linkProgramId } = this.props;
        const baseUrl = `${(process.env.REACT_APP_TRACKER_CAPTURE_APP_PATH || '..').replace(/\/$/, '')}/#/dashboard?`;
        const baseParams = `tei=${id}&ou=${orgUnitId}`;
        const params = linkProgramId ? `${baseParams}&program=${linkProgramId}` : baseParams;
        return baseUrl + params;
    }
    render() {
        const { name } = this.props;
        return (
            <a
                href={this.getUrl()}
                target="_blank"
                rel="noopener noreferrer"
            >
                {name}
            </a>
        );
    }
}
