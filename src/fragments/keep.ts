import { FluxParameterLike } from '@influxdata/influxdb-client';
import { fluxListOfStrings } from '../base/utils';
import { QueryFragment } from './queryFragment';

export class KeepFragment extends QueryFragment {
  protected functionName = 'keep';

  constructor(protected columns: string[]) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [['columns', fluxListOfStrings(this.columns)]];
  }
}
