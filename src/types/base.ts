import { ParameterizedQuery } from '@influxdata/influxdb-client';

export type FluxFieldTypes = number | bigint | string | boolean;

export type Fields<TReturnType> = Extract<keyof TReturnType, string>;

export type QueryLine = ParameterizedQuery;
export type BucketName = string;
export type FieldName = string;
export type FluxFunctionName = 'mean' | 'min' | 'max' | 'sum';

type FluxDurationUnits = 'ns' | 'us' | 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'mo' | 'y';
export type FluxDurationString = `${number}${FluxDurationUnits}`;
