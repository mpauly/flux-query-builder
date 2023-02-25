import { flux, fluxExpression, fluxFloat, FluxParameterLike } from '@influxdata/influxdb-client';
import { FluxFunction } from '../base/function';
import { FluxFields, FluxFieldTypes, FluxTagValue } from '../types/base';
import { FluxFilterOptions, FluxFilterQuery, GT_KEY, IN_KEY, LT_KEY } from '../types/filter';
import { QueryFragment } from './queryFragment';

export class FilterFragment<
  TReturnType extends Record<string, FluxFieldTypes | Date> = Record<string, FluxFieldTypes>
> extends QueryFragment {
  protected functionName = 'filter';

  constructor(protected filter: string | FluxFunction<any, boolean> | FluxFilterQuery<TReturnType>) {
    super();
  }

  buildFieldFilter<TField extends FluxFields<TReturnType>>(
    field: TField,
    value: FluxTagValue | FluxFilterOptions<TReturnType[TField]>
  ) {
    if (typeof value === 'object') {
      const inList = value[IN_KEY];
      if (inList) {
        const set = inList.map((v) => flux`${v}`).join(', ');
        return flux`contains(value: r[${field}], set: [${fluxExpression(set)}])`;
      }
      const gtValue = value[GT_KEY];
      if (gtValue) {
        return flux`${field} > ${fluxFloat(gtValue)}])`;
      }
      const ltValue = value[LT_KEY];
      if (ltValue) {
        return flux`${field} < ${fluxFloat(gtValue)}])`;
      }
    }
    return flux`r[${field}] == ${value}`;
  }

  buildFilterFunction(filters: FluxFilterQuery<TReturnType>, concat: 'and' | 'or' = 'and'): FluxFunction<any, boolean> {
    const filterString = Object.entries(filters)
      .filter(([_key, value]) => value !== undefined)
      .map(([key, value]) => this.buildFieldFilter(key as FluxFields<TReturnType>, value as FluxTagValue))
      .join(` ${concat} `);
    const fluxQuery = flux`(r) => ${fluxExpression(filterString)}`;
    return new FluxFunction<any, boolean>(fluxQuery);
  }

  buildFilter(filter: string | FluxFunction<any, boolean> | FluxFilterQuery<TReturnType>): FluxFunction<any, boolean> {
    if (typeof filter === 'string') {
      return this.buildFilter(new FluxFunction<any, boolean>(filter));
    }
    if (filter instanceof FluxFunction) {
      return filter;
    }
    return this.buildFilterFunction(filter);
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    const filterFunction = this.buildFilter(this.filter);
    return [['fn', filterFunction.renderFlux()]];
  }
}
