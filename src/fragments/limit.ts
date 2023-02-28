import { fluxInteger, FluxParameterLike } from '@influxdata/influxdb-client';
import { QueryFragment } from './queryFragment';

export class LimitFragment extends QueryFragment {
  protected functionName = 'limit';

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
