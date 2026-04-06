## Monitoring

- alerts based on p95 or p99. The more requests you have the more stable p99 is. If traffic is low p99 can be more noisy. Show both p95 and p99, make alerts based on p95 and switch to p99 if needed

#### Request Metrics

- if there are too many endpoints, single dashboard might be overloaded, consider splitting, for example, by domain (users, order, ...)
-

## Metrics and Functions

- `_sum` - total cumulative metric. Always increasing (e.g. total time spent handling requests)
- `_count` - total cumulative metric. Always increasing (e.g. number of requests)
- `_bucket` - distribution of points split into ranges. Used for percentiles

`_sum` and `_count` might be confusing how to use them

Let's take a look at http server metrics:

- `_sum` - total time spent handling requests
- `_count` - total requests handled

Why would I want to know how much time a server spent handling requests or how many requests a server handled since the beginning. However, we can split this information into buckets and calculate "requests per {interval}" or "average request duration"

`rate(metric[range_vector])` function calculates **per-second** average rate in the range vector

For example, those are our metrics

```
t=0s   sum=0ms    count=0
t=30s  sum=1500ms count=30
t=60s  sum=2250ms count=50
t=90s  sum=2250ms count=50  # no requests within (60,90]
t=120s sum=6250ms count=100
```

`rate` function calculates for every scrape

```
rate(sum[1m]):
t=30s  rate(sum[1m]) = (1500 - 0) / (30 - 0)      = 50 ms/s
t=60s  rate(sum[1m]) = (2250 - 0) / (60 - 0)      = 37.5 ms/s
t=90s  rate(sum[1m]) = (2250 - 1500) / (90 - 30)  = 12.5 ms/s
t=120s rate(sum[1m]) = (6250 - 2250) / (120 - 60) = 66.67 ms/s
```

- Request per second calculation

```
rate(count[1m]):
t=30s  rate(count[1m]) = (30 - 0) / (30 - 0)     = 1 req/s
t=60s  rate(count[1m]) = (50 - 0) / (60 - 0)     = 0.83 req/s
t=90s  rate(count[1m]) = (50 - 30) / (90 - 30)   = 0.34 req/s
t=120s rate(count[1m]) = (100 - 50) / (120 - 60) = 0.83 req/s
```

- AVG request duration calculation

Calculate how much time of a second spent handling requests

```
rate(sum[1m]):
t=30s  rate(sum[1m]) = (1500 - 0) / (30 - 0)      = 50 ms/s
t=60s  rate(sum[1m]) = (2250 - 0) / (60 - 0)      = 37.5 ms/s
t=90s  rate(sum[1m]) = (2250 - 1500) / (90 - 30)  = 12.5 ms/s
t=120s rate(sum[1m]) = (6250 - 2250) / (120 - 60) = 66.67 ms/s
```

Then, sum it

```
sum by (group_by_params) (rate(sum[1m]))
```

Then, divide by number of requests

```
(sum by (group_by_params) (rate(sum[1m]))) / (sum by (group_by_params) (rate(count[1m])))
```
