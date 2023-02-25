import { flux } from '@influxdata/influxdb-client';
import { FluxBucketName, FluxQueryLine } from '../types/base';
import { Renderable } from './queryFragment';

export class FromFragment implements Renderable {
  constructor(protected name: FluxBucketName) {}

  renderFlux(): FluxQueryLine {
    return flux`from(bucket: ${this.name})`;
  }
}
