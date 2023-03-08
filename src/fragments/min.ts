import { FluxParameterLike, fluxString } from '@influxdata/influxdb-client';
import { QueryFragment } from './queryFragment';

export class MinFragment extends QueryFragment {
  protected functionName = 'min';

  constructor(protected column?: string) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [['column', this.column === undefined ? undefined : fluxString(this.column)]];
  }
}
