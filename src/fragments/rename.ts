import { FluxParameterLike } from '@influxdata/influxdb-client';
import { fluxDict } from '../base/utils';
import { QueryFragment } from './queryFragment';

export class RenameFragment extends QueryFragment {
  protected functionName = 'drop';

  constructor(protected columns: { [old: string]: string }) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [['columns', fluxDict(this.columns)]];
  }
}
