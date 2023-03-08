import { fluxInteger, FluxParameterLike } from '@influxdata/influxdb-client';
import { QueryFragment } from './queryFragment';

export class TailFragment extends QueryFragment {
  protected functionName = 'tail';

  constructor(protected n: bigint, protected offset?: bigint) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [
      ['n', fluxInteger(this.n)],
      ['offset', this.offset === undefined ? undefined : fluxInteger(this.offset)],
    ];
  }
}
