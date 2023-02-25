import { FluxParameterLike, fluxString } from '@influxdata/influxdb-client';
import { fluxListOfStrings } from '../base/utils';
import { FluxFieldName } from '../types/base';
import { QueryFragment } from './queryFragment';

export type ModeChoices = 'by' | 'except';

export class GroupFragment extends QueryFragment {
  protected functionName = 'group';

  constructor(protected optionalArgs?: { columns?: FluxFieldName[]; mode?: ModeChoices }) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    const cols = this.optionalArgs?.columns === undefined ? undefined : fluxListOfStrings(this.optionalArgs.columns);
    return [
      ['columns', cols],
      ['mode', this.optionalArgs?.mode === undefined ? undefined : fluxString(this.optionalArgs.mode)]
    ];
  }
}
