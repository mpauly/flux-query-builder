import { from } from '../src';
import { expect, test } from '@jest/globals';
import { fluxExpression } from '@influxdata/influxdb-client';

// this"normalization" removes all whitespaces - not ideal for now, but good enough
function normalizeQuery(query: string) {
  return query
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 2)
    .join('\n');
}

test('Test basic queries', () => {
  const start = new Date(1990, 9, 3);
  const startStr = start.toISOString();
  const stop = new Date(2000, 0, 0);
  const stopStr = stop.toISOString();

  // the following queries are taken from the flux docs
  // partially I have added a from(bucket: ...) statement, switched duration notation, and switched them to r[] instead of r. notation
  const queriesToTest = [
    {
      query: from('example-bucket')
        .range('-1d')
        .filter({ _measurement: 'example-measurement' })
        .mean()
        .yield('_results'),
      fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: duration(v: "-1d"))
            |> filter(fn: (r) => r["_measurement"] == "example-measurement")
            |> mean()
            |> yield(name: "_results")
            `
    },
    {
      query: from('example-bucket').range(start, stop).aggregateWindow('1w', 'mean', { offset: '-3d' }),
      fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: time(v: "${startStr}"), stop: time(v: "${stopStr}"))
            |> aggregateWindow(every: duration(v: "1w"), fn: mean, offset: duration(v: "-3d"))
            `
    },
    {
      query: from('example-bucket')
        .range('-5m')
        .filter({ _measurement: 'mem', _field: 'used_percent' })
        .drop(['table']),
      fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: duration(v: "-5m"))
            |> filter(fn: (r) => r["_measurement"] == "mem" and r["_field"] == "used_percent")
            |> drop(columns: ["table"])
            `
    },
    {
      query: from('example-bucket')
        .range('-1h')
        .filter({ _measurement: 'example-measurement-name', mytagname: 'example-tag-value' })
        .filter({ _field: 'example-field-name' })
        .rawFlux('|> first()'),
      fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: duration(v: "-1h"))
            |> filter(fn: (r) => r["_measurement"] == "example-measurement-name" and r["mytagname"] == "example-tag-value")
            |> filter(fn: (r) => r["_field"] == "example-field-name")
            |> first()
            `
    },
    {
      query: from('example-bucket')
        .group({ columns: ['_time'] })
        .mean()
        .group({ columns: ['_value', '_time'], mode: 'except' }),
      fluxQuery: `
            from(bucket: "example-bucket")
            |> group(columns: ["_time"])
            |> mean()
            |> group(columns: ["_value", "_time"], mode: "except")
            `
    },
    {
      query: from('example-bucket')
        .range('-12h')
        .filter({ _measurement: 'system', _field: 'uptime' })
        .sort({ columns: ['region', 'host', '_value'] })
        .limit(10n),
      fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: duration(v: "-12h"))
            |> filter(fn: (r) => r["_measurement"] == "system" and r["_field"] == "uptime")
            |> sort(columns: ["region", "host", "_value"])
            |> limit(n: 10)
            `
    },
    // {
    //     query: from('example-bucket'),
    //     fluxQuery: `
    //     from(bucket: "example-bucket")
    //     |> window(every: 1m)
    //     |> mean()
    //     |> duplicate(column: "_stop", as: "_time")
    //     |> window(every: inf)
    //     `
    // },
    {
      query: from('example-bucket')
        .range('-10m')
        .filter({ _measurement: 'mem', _field: 'active' })
        .map({ _value: { ['$/']: 1073741824 } }),
      fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: duration(v: "-10m"))
            |> filter(fn: (r) => r["_measurement"] == "mem" and r["_field"] == "active")
            |> map(fn: (r) => ({r with _value: r["_value"] / 1073741824}))
            `
    },
    {
      query: from('example-bucket')
        .pivot(['_time'], ['_field'], '_value')
        .map({ _value: fluxExpression('(r.field1 + r.field2) / r.field3 * 100.0') }),
      fluxQuery: `
            from(bucket: "example-bucket")
            |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> map(fn: (r) => ({r with _value: (r.field1 + r.field2) / r.field3 * 100.0}))        
            `
    },
    {
      query: from('example-bucket')
        .range('-1h')
        .filter({ _measurement: { $in: ['m1', 'm2'] }, _field: { $in: ['field1', 'field2'] } })
        .group()
        .pivot(['_time'], ['_field'], '_value')
        .map({ _value: fluxExpression('r.field1 / r.field2 * 100.0') }),
      fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: duration(v: "-1h"))
            |> filter(fn: (r) => contains(value: r["_measurement"], set: ["m1", "m2"]) and contains(value: r["_field"], set: ["field1", "field2"]))
            |> group()
            |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> map(fn: (r) => ({r with _value: r.field1 / r.field2 * 100.0}))      
            `
    }
  ];

  queriesToTest.forEach((q) => {
    expect(normalizeQuery(q.query.renderFluxQuery())).toEqual(normalizeQuery(q.fluxQuery));
  });
});
