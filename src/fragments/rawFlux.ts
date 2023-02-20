import { ParameterizedQuery } from '@influxdata/influxdb-client';
import { QueryFragment, Renderable } from './queryFragment';

export class RawFluxFragment implements Renderable {
  constructor(protected flux: ParameterizedQuery) {}

  public renderFlux(): ParameterizedQuery {
    return this.flux;
  }
}
