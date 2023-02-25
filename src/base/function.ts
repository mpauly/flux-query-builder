import { fluxExpression } from '@influxdata/influxdb-client';
import { FluxQueryLine } from '../types/base';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class FluxFunction<InputType, ReturnType> {
  constructor(protected source: string | FluxQueryLine) {}
  renderFlux() {
    return fluxExpression(this.source);
  }
}
