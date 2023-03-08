import { FluxParameterLike, fluxString } from '@influxdata/influxdb-client';
import { QueryFragment } from './queryFragment';

export class CountFragment extends QueryFragment {
  protected functionName = 'count';

  constructor(protected column?: string) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [['columns', this.column === undefined ? undefined : fluxString(this.column)]];
  }
}
