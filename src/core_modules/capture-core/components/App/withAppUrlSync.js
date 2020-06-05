// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { paramsSelector } from './appSync.selectors';
import LoadingMaskForPage from '../LoadingMasks/LoadingMaskForPage.component';
import {
    updateSelectionsFromUrl as updateSelectionsFromUrlForNewEvent,
} from '../Pages/NewEvent';
import {
    updateSelectionsFromUrl as updateSelectionsFromUrlForNewEnrollment,
} from '../Pages/NewEnrollment';
import {
    viewEventFromUrl,
} from '../Pages/ViewEvent/viewEvent.actions';
import {
    updateSearchSelectionsFromUrl,
} from '../LockedSelector';

import { reservedUrlKeys } from '../UrlSync/withUrlSync';
import type { UpdateDataContainer } from '../UrlSync/withUrlSync';

type Props = {
    location: {
        pathname: string,
    },
    onUpdateFromUrl: (page: ?string, data: UpdateDataContainer) => void,
    params: Object,
    page: ?string,
    locationSwitchInProgress: ?boolean,
};

const pageKeys = {
    MAIN: '',
    NEW_EVENT: 'newEvent',
    VIEW_EVENT: 'viewEvent',
    NEW_ENROLLMENT: 'newEnrollment',
    SEARCH: 'search',
};

const specificationForPages = {
    [pageKeys.MAIN]: [
        {
            urlKey: 'programId',
            propKey: 'programId',
        },
        {
            urlKey: 'orgUnitId',
            propKey: 'orgUnitId',
        },
    ],
    [pageKeys.NEW_EVENT]: [
        {
            urlKey: 'programId',
            propKey: 'programId',
        },
        {
            urlKey: 'orgUnitId',
            propKey: 'orgUnitId',
        },
    ],
    [pageKeys.VIEW_EVENT]: [
        {
            urlKey: reservedUrlKeys.ENTIRE_PARAM_STRING,
            propKey: 'viewEventId',
        },
    ],
    [pageKeys.NEW_ENROLLMENT]: [
        {
            urlKey: 'programId',
            propKey: 'programId',
        },
        {
            urlKey: 'orgUnitId',
            propKey: 'orgUnitId',
        },
    ],
    [pageKeys.SEARCH]: [
        {
            urlKey: 'programId',
            propKey: 'programId',
        },
        {
            urlKey: 'orgUnitId',
            propKey: 'orgUnitId',
        },
    ],
};

const updaterForPages = {
    [pageKeys.MAIN]: updateSearchSelectionsFromUrl,
    [pageKeys.NEW_EVENT]: updateSelectionsFromUrlForNewEvent,
    [pageKeys.SEARCH]: updateSearchSelectionsFromUrl,
    [pageKeys.VIEW_EVENT]: viewEventFromUrl,
    [pageKeys.NEW_ENROLLMENT]: updateSelectionsFromUrlForNewEnrollment,
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

        handleUpdate = (updateData: UpdateDataContainer) => {
            this.props.onUpdateFromUrl(this.page, updateData);
        }

        getSyncSpecification() {
            const page = this.page || pageKeys.MAIN;
            return specificationForPages[page] || [];
        }

        setPageAndParams() {
            const urlParts = getUrlParts(this.props.location.pathname);

            if (urlParts.length === 0) {
                this.page = pageKeys.MAIN;
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
                    this.page = pageKeys.MAIN;
                }
            } else {
                this.page = urlParts[0];
                this.params = urlParts[1];
            }
        }

        render() {
            const {
                location,
                onUpdateFromUrl,
                locationSwitchInProgress,
                params,
                page,
                ...passOnProps
            } = this.props;

            if (locationSwitchInProgress) {
                return (
                    <LoadingMaskForPage />
                );
            }

            this.setPageAndParams();

            return (
                <InnerComponent
                    statePage={page || pageKeys.MAIN}
                    urlPage={this.page}
                    urlParams={this.params}
                    onUpdate={this.handleUpdate}
                    syncSpecification={this.getSyncSpecification()}
                    stateParams={params}
                    {...passOnProps}
                />
            );
        }
    }

    const mapStateToProps = (state: ReduxState) => ({
        params: paramsSelector(state),
        page: state.app.page,
        locationSwitchInProgress: state.app.locationSwitchInProgress,
    });

    const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
        onUpdateFromUrl: (page: ?string, updateData: UpdateDataContainer) => {
            let l;
            return dispatch(updaterForPages[page](updateData));
        },
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
