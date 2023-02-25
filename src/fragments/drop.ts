import { FluxParameterLike } from '@influxdata/influxdb-client';
import { fluxListOfStrings } from '../base/utils';
import { FluxFieldName } from '../types/base';
import { QueryFragment } from './queryFragment';

export class DropFragment extends QueryFragment {
  protected functionName = 'drop';

  constructor(protected columns: string[]) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [['columns', fluxListOfStrings(this.columns)]];
  }
}
