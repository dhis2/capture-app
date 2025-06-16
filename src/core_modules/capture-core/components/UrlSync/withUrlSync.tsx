import * as React from 'react';
import queryString from 'query-string';
import type { ParsedQuery } from 'query-string';
import { pageFetchesOrgUnitUsingTheOldWay } from '../../utils/url';
import type { Props, SyncSpecification, SyncSpecificationGetter, UpdateDataContainer } from './withUrlSync.types';

export type { UpdateDataContainer } from './withUrlSync.types';

const getUrlSyncer = (
    InnerComponent: React.ComponentType<Record<string, unknown>>,
    onGetSyncSpecification: SyncSpecificationGetter) =>
    class UrlSyncer extends React.Component<Props> {
        static getValueFromParam(param: Array<string> | null, id: string): string | null {
            let value: string | null = null;
            if (param && param.length > 0) {
                const regExp = new RegExp(`${id}=`, 'i');
                const result = param[param.length - 1].replace(regExp, '').trim();
                value = result || null;
            }
            return value;
        }

        static getNextProps(locationParams: Record<string, unknown>, syncSpecification: Array<SyncSpecification>) {
            const nextParams = Object
                .keys(locationParams)
                .reduce((accNextParams, locationKey) => {
                    const syncSpec = syncSpecification.find(s => s.urlParameterName === locationKey);
                    const paramName = syncSpec?.urlParameterName || locationKey;
                    accNextParams[paramName] = locationParams[locationKey];
                    return accNextParams;
                }, {} as Record<string, unknown>);

            return nextParams;
        }

        componentDidMount() {
            this.triggerSyncCallback();
        }

        componentDidUpdate() {
            this.triggerSyncCallback();
        }

        queuedUpdate: { nextProps: Record<string, unknown> } | null = null;

        update(updateData: UpdateDataContainer) {
            this.props.onUpdate(updateData);
        }

        noUpdateRequired() {
            this.props.onNoUpdateRequired && this.props.onNoUpdateRequired();
        }

        triggerSyncCallback() {
            if (this.queuedUpdate) {
                this.update({
                    nextProps: this.queuedUpdate.nextProps,
                    prevProps: this.props.stateParams || {},
                    nextPage: this.props.urlPage,
                    prevPage: this.props.statePage,
                });
                this.queuedUpdate = null;
            } else {
                this.noUpdateRequired();
            }
        }

        paramsNeedsUpdate(syncSpecifications: Array<SyncSpecification>, locationParams: ParsedQuery) {
            return syncSpecifications
                .some((spec) => {
                    const locationValue = locationParams[spec.urlParameterName];
                    const propValue = (this.props.stateParams && this.props.stateParams[spec.urlParameterName]) || undefined;
                    return locationValue !== propValue;
                });
        }

        isOutOfSync() {
            const syncSpecification = onGetSyncSpecification(this.props);
            const { history: { location }, statePage, urlPage } = this.props;
            const locationParams = queryString.parse(location && location.search);
            const urlParamsAreOutOfSync = this.paramsNeedsUpdate(syncSpecification, locationParams);
            const urlPathnameIsOutOfSync = urlPage !== statePage;

            if (urlPathnameIsOutOfSync || urlParamsAreOutOfSync) {
                const nextProps = UrlSyncer.getNextProps(locationParams, syncSpecification);
                this.queuedUpdate = { nextProps };
                return true;
            }
            return false;
        }

        render() {
            const { onUpdate, urlParams, stateParams, urlPage, statePage, ...passOnProps } = this.props;
            const urlOutOfSync = this.isOutOfSync();

            if (urlOutOfSync && pageFetchesOrgUnitUsingTheOldWay(urlPage)) {
                return (
                    <InnerComponent
                        urlOutOfSync
                        {...passOnProps}
                    />
                );
            }

            return (
                <InnerComponent
                    {...passOnProps}
                />
            );
        }
    };

export const withUrlSync = (onGetSyncSpecification: SyncSpecificationGetter) =>
    (InnerComponent: React.ComponentType<Record<string, unknown>>) =>
        getUrlSyncer(InnerComponent, onGetSyncSpecification);
