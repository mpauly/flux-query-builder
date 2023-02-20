# flux-query-builder

A typescript query builder for the [flux language](https://www.influxdata.com/products/flux/). The query builder features **extensive typing** and **short hands for common operations**.

As a simple example the call

```typescript
const query = from('example-bucket')
  .range('-1h')
  .filter({ _measurement: { $in: ['m1', 'm2'] }, _field: { $in: ['field1', 'field2'] } })
  .group()
  .pivot(['_time'], ['_field'], '_value')
  .map({ _value: fluxExpression('r.field1 / r.field2 * 100.0') });
```

yields the following flux query

```
from(bucket: "example-bucket")
|> range(start: duration(v: "-1h"))
|> filter(fn: (r) => contains(value: r["_measurement"], set: ["m1", "m2"]) and contains(value: r["_field"], set: ["field1", "field2"]))
|> group()
|> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
|> map(fn: (r) => ({r with _value: r.field1 / r.field2 * 100.0}))
```

So you don't have to remember the details of the `map` or `filter` syntax, instead have strong type support in writing a query, but do not lose the power of the flux query language.

In addition, you can provide type information to the query builder. A query such as

```typescript
// this interface defines the available fields and tags
interface WeatherSchema {
  fields: { temperature: number; precipitation: number };
  tags: { quality: ['measured', 'forecast']; location: ['zurich', 'berlin'] };
}

const weatherRepo = new InfluxRepository<WeatherSchema, 'weather'>(db, org, bucket, 'weather');
const query = weatherRepo
  .from()
  .range(start, stop)
  // pivot and drop modify the return type correctly
  .pivot(['_time', '_measurement'], ['quality'], '_value')
  .drop(['_time'])
  .limit(100n);
```

then leads to an object with correct typing, see the screenshot below.

![Screenshot of type-hints](https://raw.githubusercontent.com/mpauly/flux-query-builder/main/docs/type-hints.png 'Type hints in the flux query builder')

## Status

The query builder is actively being developed. At the moment it only supports a selection of functions from the flux query language. If you are missing a function, you are more than welcome to open a PR. Adding new functions in most cases should be straightforward.
Additionally, the `rawFlux()` function allows you to execute raw flux queries, should your use-case not be supported by the query builder yet.

## Usage

For some examples of how to build queries see the tests. In principle there are two ways to use the query builder: Either you can use the query builder without type hints by directly calling the `from(bucket)` function. Or you can instantiate a repository with the `InfluxRepository` constructor and appropriate type hints and then use its `from()` method to also obtain type hints.

A more detailed documentation will follow at some later point.
