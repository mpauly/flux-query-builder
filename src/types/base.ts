import { ParameterizedQuery } from '@influxdata/influxdb-client';

export type FluxFieldTypes = number | bigint | string | boolean;
export type FluxTagValue = string | number | boolean;

export type FluxFields<TReturnType> = Extract<keyof TReturnType, string>;

export type FluxQueryLine = ParameterizedQuery;
export type FluxBucketName = string;
export type FluxFieldName = string;
export type FluxFunctionName = 'mean' | 'min' | 'max' | 'sum';

type FluxDurationUnits = 'ns' | 'us' | 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'mo' | 'y';
export type FluxDurationString = `${number}${FluxDurationUnits}`;
