import { FluxParameterLike, fluxString } from '@influxdata/influxdb-client';
import { QueryFragment } from './queryFragment';

export class YieldFragment extends QueryFragment implements QueryFragment {
  protected functionName = 'yield';

  constructor(protected name?: string) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [['name', this.name === undefined ? undefined : fluxString(this.name)]];
  }
}
