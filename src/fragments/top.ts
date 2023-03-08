import { fluxInteger, FluxParameterLike } from '@influxdata/influxdb-client';
import { fluxListOfStrings } from '../base/utils';
import { QueryFragment } from './queryFragment';

export class TopFragment extends QueryFragment {
  protected functionName = 'top';

  constructor(protected n: bigint, protected columns?: string[]) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [
      ['n', fluxInteger(this.n)],
      ['columns', this.columns === undefined ? undefined : fluxListOfStrings(this.columns)],
    ];
  }
}
