import { FluxParameterLike, fluxString } from '@influxdata/influxdb-client';
import { QueryFragment } from './queryFragment';

export class MeanFragment extends QueryFragment {
  protected functionName = 'mean';

  constructor(protected column?: string) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [['column', this.column === undefined ? undefined : fluxString(this.column)]];
  }
}
