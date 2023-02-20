import { fluxBool, FluxParameterLike } from '@influxdata/influxdb-client';
import { fluxListOfStrings } from '../base/utils';
import { FieldName } from '../types/base';
import { QueryFragment } from './queryFragment';

export class SortFragment extends QueryFragment {
  protected functionName = 'sort';

  constructor(protected optionalArgs?: { columns?: FieldName[]; desc?: boolean }) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    const cols = this.optionalArgs?.columns === undefined ? undefined : fluxListOfStrings(this.optionalArgs.columns);
    return [
      ['columns', cols],
      ['desc', this.optionalArgs?.desc === undefined ? undefined : fluxBool(this.optionalArgs.desc)]
    ];
  }
}
