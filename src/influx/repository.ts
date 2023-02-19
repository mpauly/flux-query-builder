import { InfluxDB, QueryApi, WriteApi } from '@influxdata/influxdb-client';
import { FluxQuery, from } from '../base/query';

interface BaseSchema {
  fields: { [name: string]: number | bigint | string | boolean };
  tags: { [name: string]: string[] };
}

type FieldsOfSchema<Schema extends BaseSchema> = keyof Schema['fields'];
type FieldTypesOfSchema<Schema extends BaseSchema> = Schema['fields'][keyof Schema['fields']];

export class InfluxRepository<TSchema extends BaseSchema, TMeasurement extends string> {
  protected queryApi: QueryApi;
  protected writeApi: WriteApi;

  constructor(
    protected influxDb: InfluxDB,
    protected influxOrg: string,
    protected bucket: string,
    protected measurement: TMeasurement
  ) {
    this.queryApi = influxDb.getQueryApi(influxOrg);
    this.writeApi = influxDb.getWriteApi(influxOrg, bucket, 'ms');
  }

  from() {
    return from<
      {
        result: '_result';
        table: number;
        _start: Date;
        _stop: Date;
        _time: Date;
        _value: FieldTypesOfSchema<TSchema>;
        _field: FieldsOfSchema<TSchema>;
        _measurement: TMeasurement;
      } & { [tag in keyof TSchema['tags']]: TSchema['tags'][tag][number] }
    >(this.bucket);
  }

  query<TReturnType>(query: FluxQuery<TReturnType>): AsyncIterable<TReturnType> {
    const fluxQuery = query.renderFluxQuery();
    const iterator = this.queryApi.iterateRows(fluxQuery);
    return {
      [Symbol.asyncIterator]: async function* () {
        for await (const { values, tableMeta } of iterator) {
          const obj = tableMeta.toObject(values) as TReturnType;
          yield obj;
        }
      }
    };
  }
}
