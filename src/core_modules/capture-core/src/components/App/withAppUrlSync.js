// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import {
    updateMainSelectionsFromUrl as updateMainSelectionsFromUrlForMainPage,
} from '../Pages/MainPage/mainSelections.actions';
import {
    updateSelectionsFromUrl as updateSelectionsFromUrlForNewEvent,
} from '../Pages/NewEvent/newEventSelections.actions';

type Props = {
    location: {
        pathname: string,
    },
    onUpdateFromUrl: (selections: Object, page: string) => void,
    programId: ?string,
    orgUnitId: ?string,
    page: ?string,
    pageSwitchInTransition: ?boolean,
};

const pageKeys = {
    main: 'main',
    newEvent: 'newEvent',
    editEvent: 'event',
};

const specificationForPages = {
    [pageKeys.main]: [
        {
            urlKey: 'programId',
            propKey: 'programId',
        },
        {
            urlKey: 'orgUnitId',
            propKey: 'orgUnitId',
        },
    ],
    [pageKeys.newEvent]: [
        {
            urlKey: 'programId',
            propKey: 'programId',
        },
        {
            urlKey: 'orgUnitId',
            propKey: 'orgUnitId',
        },
    ],
    [pageKeys.editEvent]: [],
};

const updaterForPages = {
    [pageKeys.main]: updateMainSelectionsFromUrlForMainPage,
    [pageKeys.newEvent]: updateSelectionsFromUrlForNewEvent,
};

const getUrlParts = (pathName: string) => {
    const urlParts = pathName.match(/[/][^/]+/g);

    if (urlParts == null) {
        return [];
    }

    return urlParts
        .map(part => part.substring(1));
};

const withAppUrlSync = () => (InnerComponent: React.ComponentType<any>) => {
    class AppUrlSyncer extends React.Component<Props> {
        params: ?string;
        page: string;

        handleUpdate = (selections: Object) => {
            const page = this.page;
            this.props.onUpdateFromUrl(selections, page);
        }

        getSyncSpecification() {
            const page = this.page || pageKeys.main;
            return specificationForPages[page] || [];
        }

        setPageAndParams() {
            const urlParts = getUrlParts(this.props.location.pathname);

            if (urlParts.length === 0) {
                this.page = pageKeys.main;
                this.params = null;
                return;
            }

            if (urlParts.length === 1) {
                const singlePart = urlParts[0];
                if (
                    Object
                        .keys(pageKeys)
                        .map(key => pageKeys[key])
                        .includes(singlePart)
                ) {
                    this.page = singlePart;
                    this.params = null;
                } else {
                    this.params = singlePart;
                    this.page = pageKeys.main;
                }
            } else {
                this.page = urlParts[0];
                this.params = urlParts[1];
            }
        }

        getStateParams() {
            return {
                programId: this.props.programId,
                orgUnitId: this.props.orgUnitId,
            };
        }

        render() {
            const { location, onUpdateFromUrl, pageSwitchInTransition, programId, orgUnitId, page, ...passOnProps } = this.props;

            if (pageSwitchInTransition) {
                return null;
            }

            this.setPageAndParams();

            return (
                <InnerComponent
                    statePage={page || pageKeys.main}
                    urlPage={this.page}
                    urlParams={this.params}
                    onUpdate={this.handleUpdate}
                    syncSpecification={this.getSyncSpecification()}
                    stateParams={this.getStateParams()}
                    {...passOnProps}
                />
            );
        }
    }

    const mapStateToProps = (state: ReduxState) => ({
        programId: state.currentSelections.programId,
        orgUnitId: state.currentSelections.orgUnitId,
        page: state.app.page,
        pageSwitchInTransition: state.app.pageSwitchInTransition,
    });

    const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
        onUpdateFromUrl: (selections: Object, page: string) => dispatch(updaterForPages[page](selections, page)),
    });

    return connect(mapStateToProps, mapDispatchToProps)(AppUrlSyncer);
};

/**
 * Provides data for withUrlSync and calls an update action if not in sync (based on the page)
 * @alias withAppUrlSync
 * @memberof UrlSync
 * @function
 */

export default withAppUrlSync;
