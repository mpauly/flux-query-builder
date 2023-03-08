import { FluxParameterLike } from '@influxdata/influxdb-client';
import { fluxListOfStrings } from '../base/utils';
import { QueryFragment } from './queryFragment';

export class DistinctFragment extends QueryFragment {
  protected functionName = 'distinct';

  constructor(protected columns?: string[]) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [['columns', this.columns === undefined ? undefined : fluxListOfStrings(this.columns)]];
  }
}
