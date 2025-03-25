/**
 * @namespace UrlSync
 */
import * as React from 'react';
import queryString from 'query-string';
import { pageFetchesOrgUnitUsingTheOldWay } from '../../utils/url';

type Props = {
    urlPage: string;
    statePage: string;
    urlParams?: string | null;
    stateParams: Record<string, unknown> | null;
    onUpdate: (selections: Record<string, unknown>) => void;
    onNoUpdateRequired?: () => void;
    history: {
        location: {
            search: string;
        };
    };
};

type SyncSpecification = {
    urlParameterName: string;
};

type SyncSpecificationGetter = (props: Props) => Array<SyncSpecification>;

export type UpdateDataContainer = {
    nextProps: Record<string, unknown>;
    prevProps: Record<string, unknown>;
    nextPage: string | null;
    prevPage: string | null;
};

const getUrlSyncer = (
    InnerComponent: React.ComponentType<any>,
    onGetSyncSpecification: SyncSpecificationGetter) =>
    class UrlSyncer extends React.Component<Props> {
        queuedUpdate: { nextProps: Record<string, unknown> } | null = null;

        static getValueFromParam(param: Array<string> | null, id: string): string | null {
            let value = null;
            if (param && param.length > 0) {
                const regExp = new RegExp(`${id}=`, 'i');
                value = param[param.length - 1].replace(regExp, '').trim() || null;
            }
            return value;
        }

        static getNextProps(locationParams: Record<string, unknown>, syncSpecification: Array<SyncSpecification>): Record<string, unknown> {
            return Object
                .keys(locationParams)
                .reduce((accNextParams, locationKey) => {
                    const syncSpec = syncSpecification.find(s => s.urlParameterName === locationKey) || {};
                    accNextParams[syncSpec.urlParameterName || locationKey] = locationParams[locationKey];
                    return accNextParams;
                }, {} as Record<string, unknown>);
        }

        componentDidMount(): void {
            this.triggerSyncCallback();
        }

        componentDidUpdate(): void {
            this.triggerSyncCallback();
        }

        update(updateData: UpdateDataContainer): void {
            this.props.onUpdate(updateData);
        }

        noUpdateRequired(): void {
            this.props.onNoUpdateRequired?.();
        }

        triggerSyncCallback(): void {
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

        paramsNeedsUpdate(syncSpecifications: Array<SyncSpecification>, locationParams: Record<string, unknown>): boolean {
            return syncSpecifications
                .some((spec) => {
                    const locationValue = locationParams[spec.urlParameterName];
                    const propValue = (this.props.stateParams && this.props.stateParams[spec.urlParameterName]) || undefined;
                    return locationValue !== propValue;
                });
        }

        isOutOfSync(): boolean {
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

        render(): React.ReactNode {
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

/**
 * Compare values from the url params and the props (usually from the state) based on the sync specification. Calls onUpdate or onNoUpdateRequired accordingly. Additionally checks if the page has changed.
 * @alias withUrlSync
 * @memberof UrlSync
 * @example withUrlSync(props => [{ urlParameterName: 'programId' }])([InnerComponent])
 */
export const withUrlSync = (onGetSyncSpecification: SyncSpecificationGetter) =>
    (InnerComponent: React.ComponentType<unknown>) =>
        getUrlSyncer(InnerComponent, onGetSyncSpecification);
