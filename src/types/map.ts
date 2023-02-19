import { FluxParameterLike } from "@influxdata/influxdb-client";

export const ADDITION_KEY = '$+';
export const MULTIPLICATION_KEY = '$*';
export const DIVISION_KEY = '$/';
export const SUBTRACTION_KEY = '$-';

type NumberValue = number | bigint
export type FluxMapFieldOptions = {
    [ADDITION_KEY]?: NumberValue,
    [MULTIPLICATION_KEY]?: NumberValue,
    [DIVISION_KEY]?: NumberValue,
    [SUBTRACTION_KEY]?: NumberValue,
}
export type FluxMapQuery = { [field: string]: FluxParameterLike | FluxMapFieldOptions }