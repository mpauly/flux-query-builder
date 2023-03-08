import { FluxParameterLike, fluxString } from '@influxdata/influxdb-client';
import { QueryFragment } from './queryFragment';

export class DuplicateFragment extends QueryFragment {
  protected functionName = 'duplicate';

  constructor(protected column: string, protected as: string) {
    super();
  }

  protected collectArgs(): [string, FluxParameterLike | undefined][] {
    return [
      ['column', fluxString(this.column)],
      ['as', fluxString(this.as)],
    ];
  }
}
