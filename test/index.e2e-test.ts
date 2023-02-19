import { from } from '../src';
import { expect, test } from '@jest/globals';
import { fluxExpression, InfluxDB, Point } from '@influxdata/influxdb-client';
import { InfluxRepository } from '../src/influx/repository';

test('Test influx queries', async () => {
  const start = new Date(1990, 9, 3);
  const startStr = start.toISOString();
  const stop = new Date(2000, 0, 0);
  const stopStr = stop.toISOString();

  const url = 'http://localhost:8086';
  const token = 'testToken';
  const org = 'testOrg';
  const bucket = 'testBucket';

  const influx = new InfluxDB({ url, token });

  const writeApi = influx.getWriteApi(org, bucket, 'ms');

  const zurichTempPoints = [...Array(5000).keys()].map((i) =>
    new Point('weather')
      .timestamp(start.getTime() + 3600 * 1000 * i)
      .tag('quality', i < 3000 ? 'measured' : 'forecast')
      .tag('location', 'zurich')
      .floatField('temperature', 20 + Math.round(100 * Math.random()) / 10)
  );
  const zurichPrecPoints = [...Array(5000).keys()].map((i) =>
    new Point('weather')
      .timestamp(start.getTime() + 3600 * 1000 * i)
      .tag('quality', i < 3000 ? 'measured' : 'forecast')
      .tag('location', 'zurich')
      .floatField('precipitation', 20 + Math.round(100 * Math.random()) / 10)
  );

  const berlinTempPoints = [...Array(5000).keys()].map((i) =>
    new Point('weather')
      .timestamp(start.getTime() + 3600 * 1000 * i)
      .tag('quality', i < 4000 ? 'measured' : 'forecast')
      .tag('location', 'berlin')
      .floatField('temperature', 20 + Math.round(100 * Math.random()) / 10)
  );
  const berlinPrecPoints = [...Array(5000).keys()].map((i) =>
    new Point('weather')
      .timestamp(start.getTime() + 3600 * 1000 * i)
      .tag('quality', i < 4000 ? 'measured' : 'forecast')
      .tag('location', 'berlin')
      .floatField('precipitation', 20 + Math.round(100 * Math.random()) / 10)
  );

  const allPoints = [...zurichTempPoints, ...zurichPrecPoints, ...berlinTempPoints, ...berlinPrecPoints];
  console.log(`Writing ${allPoints.length} points to influx`);
  writeApi.writePoints(allPoints);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  interface WeatherSchema {
    fields: { temperature: number; precipitation: number };
    tags: { quality: ['measured', 'forecast']; location: ['zurich', 'berlin'] };
  }

  const db = new InfluxDB({ token, url });
  const weatherRepo = new InfluxRepository<WeatherSchema, 'weather'>(db, org, bucket, 'weather');
  const query = weatherRepo
    .from()
    .range(start, stop)
    .pivot(['_time', '_measurement'], ['quality'], '_value')
    .limit(100n);
  for await (const res of weatherRepo.query(query)) {
    console.log(res);
  }
  //  expect(normalizeQuery(q.query.renderFluxQuery())).toEqual(normalizeQuery(q.fluxQuery));
});
