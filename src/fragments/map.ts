import {
  flux,
  fluxExpression,
  fluxInteger,
  FluxParameterLike,
  fluxString,
  FLUX_VALUE,
} from '@influxdata/influxdb-client';
import { FluxFunction } from '../base/function';
import {
  ADDITION_KEY,
  DIVISION_KEY,
  FluxMapFieldOptions,
  FluxMapQuery,
  MULTIPLICATION_KEY,
  SUBTRACTION_KEY,
} from '../types/map';
import { QueryFragment } from './queryFragment';

function isFluxParameterLike(value: any): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return typeof value === 'object' && typeof value[FLUX_VALUE] === 'function';
}

export class MapFragment extends QueryFragment {
  protected functionName = 'map';
  constructor(protected fn: FluxFunction<any, any> | FluxMapQuery) {
    super();
  }
  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    if (this.fn instanceof FluxFunction) {
      return [['fn', this.fn.renderFlux()]];
    }
    return [['fn', this.constructMapFunction(this.fn).renderFlux()]];
  }

  protected constructMapFunction(opts: FluxMapQuery) {
    const transformString = Object.entries(opts)
      .map(([key, value]) => this.buildFieldTransform(key, value))
      .join(`, `);
    const fluxQuery = flux`(r) => ({r with ${fluxExpression(transformString)}})`;
    return new FluxFunction<any, boolean>(fluxQuery);
  }

  protected buildFieldTransform(field: string, valueIn: FluxParameterLike | FluxMapFieldOptions) {
    if (isFluxParameterLike(valueIn)) {
      return fluxExpression(`${field}: ${valueIn}`);
    }
    const value = valueIn as FluxMapFieldOptions;
    let transformString = `${field}: r[${fluxString(field)}]`;
    if (value[MULTIPLICATION_KEY]) {
      transformString += ` * ${fluxInteger(value[MULTIPLICATION_KEY])}`;
    }
    if (value[DIVISION_KEY]) {
      transformString += ` / ${fluxInteger(value[DIVISION_KEY])}`;
    }
    if (value[ADDITION_KEY]) {
      transformString += ` + ${fluxInteger(value[ADDITION_KEY])}`;
    }
    if (value[SUBTRACTION_KEY]) {
      transformString += ` - ${fluxInteger(value[SUBTRACTION_KEY])}`;
    }
    return fluxExpression(transformString);
  }
}
