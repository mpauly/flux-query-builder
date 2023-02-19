import { from } from "../src";
import { expect, test } from '@jest/globals';

// this"normalization" removes all whitespaces - not ideal for now, but good enough
function normalizeQuery(query: string) {
    return query.split('\n').map((l) => l.trim()).filter((l) => l.length > 2).join('\n');
}

test('Test basic queries', () => {

    const start = new Date(1990, 9, 3)
    const startStr = start.toISOString()
    const stop = new Date(2000, 0, 0)
    const stopStr = stop.toISOString()

    // the following queries are taken from the flux docs
    // partially I have added a from(bucket: ...) statement, switched duration notation, and switched them to r[] instead of r. notation
    const queriesToTest = [
        {
            query: from('example-bucket').range('-1d').filter({ _measurement: 'example-measurement' }).mean().yield('_results'),
            fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: duration(v: "-1d"))
            |> filter(fn: (r) => r["_measurement"] == "example-measurement")
            |> mean()
            |> yield(name: "_results")
            `
        },
        {
            query: from('example-bucket').aggregateWindow('1w', 'mean', { offset: '-3d' }),
            fluxQuery: `
            from(bucket: "example-bucket")
            |> aggregateWindow(every: duration(v: "1w"), fn: mean, offset: duration(v: "-3d"))
            `
        },
        {
            query: from('example-bucket').range('-5m').filter({ _measurement: 'mem', _field: 'used_percent' }),
            fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: duration(v: "-5m"))
            |> filter(fn: (r) => r["_measurement"] == "mem" and r["_field"] == "used_percent")
            |> drop(columns: ["host"])
            `
        },
        {
            query: from('example-bucket'),
            fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: -1h)
            |> filter(fn: (r) => r._measurement == "example-measurement-name" and r.mytagname == "example-tag-value")
            |> filter(fn: (r) => r._field == "example-field-name")
            `
        },
        {
            query: from('example-bucket'),
            fluxQuery: `
            dataSet
            |> group(columns: ["_time"])
            |> mean()
            |> group(columns: ["_value", "_time"], mode: "except")
            `
        },
        {
            query: from('example-bucket'),
            fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: -12h)
            |> filter(fn: (r) => r._measurement == "system" and r._field == "uptime")
            |> sort(columns: ["region", "host", "_value"])
            |> limit(n: 10)
            `
        },
        {
            query: from('exmaple-bucket'),
            fluxQuery: `
            from(bucket: "example-bucket")
            |> window(every: 1m)
            |> mean()
            |> duplicate(column: "_stop", as: "_time")
            |> window(every: inf)
            `
        },
        {
            query: from('example-bucket'),
            fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: -10m)
            |> filter(fn: (r) => r._measurement == "mem" and r._field == "active")
            |> map(fn: (r) => ({r with _value: r._value / 1073741824}))
            `
        },
        {
            query: from('example-bucket'),
            fluxQuery: `
            from(bucket: "example-bucket")
            |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> map(fn: (r) => ({r with _value: (r.field1 + r.field2) / r.field3 * 100.0}))        
            `
        },
        {
            query: from('example-bucket'),
            fluxQuery: `
            from(bucket: "example-bucket")
            |> range(start: -1h)
            |> filter(fn: (r) => (r._measurement == "m1" or r._measurement == "m2") and (r._field == "field1" or r._field == "field2"))
            |> group()
            |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> map(fn: (r) => ({r with _value: r.field1 / r.field2 * 100.0}))      
            `
        }
    ]

    queriesToTest.forEach((q) => {
        expect(normalizeQuery(q.query.renderFluxQuery())).toEqual(normalizeQuery(q.fluxQuery));
    })
});