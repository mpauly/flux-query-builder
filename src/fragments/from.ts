import { flux } from '@influxdata/influxdb-client';
import { BucketName, QueryLine } from '../types/base';
import { Renderable } from './queryFragment';

export class FromFragment implements Renderable {
  constructor(protected name: BucketName) {}

  renderFlux(): QueryLine {
    return flux`from(bucket: ${this.name})`;
  }
}
