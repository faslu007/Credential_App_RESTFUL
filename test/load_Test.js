
const autocannon = require('autocannon')

    // Test Script
    const instance = autocannon({
    url: 'http://localhost:5000/api/users/login',
    connections: 10,
    duration: 20,
    requests: [
    {
    method: 'GET',
    body: JSON.stringify({
    email: 'ericka.shanahan@ethereal.email',
    password: 'km3uRwW5M7BaP5WV1a'
    }),
    },
    
    ] }, console.log)


    // TEST_REPORT - 

// null {
    
//     title: undefined,
//     url: 'http://localhost:5000/api/users/login',
//     socketPath: undefined,
//     connections: 10,
//     sampleInt: 1000,
//     pipelining: 1,
//     workers: undefined,
//     duration: 20.17,
//     samples: 20,
//     start: 2022-09-11T20:39:30.236Z,
//     finish: 2022-09-11T20:39:50.401Z,
//     errors: 0,
//     timeouts: 0,
//     mismatches: 0,
//     non2xx: 0,
//     resets: 0,
//     '1xx': 0,
//     '2xx': 1982,
//     '3xx': 0,
//     '4xx': 0,
//     '5xx': 0,
//     statusCodeStats: { '200': { count: 1982 } },
//     latency: {
//       average: 99.57,
//       mean: 99.57,
//       stddev: 83.25,
//       min: 34,
//       max: 642,
//       p0_001: 34,
//       p0_01: 34,
//       p0_1: 35,
//       p1: 38,
//       p2_5: 41,
//       p10: 48,
//       p25: 58,
//       p50: 75,
//       p75: 98,
//       p90: 167,
//       p97_5: 373,
//       p99: 486,
//       p99_9: 616,
//       p99_99: 642,
//       p99_999: 642,
//       totalCount: 1982
//     },
//     requests: {
//       average: 99.1,
//       mean: 99.1,
//       stddev: 4.39,
//       min: 84,
//       max: 102,
//       total: 1982,
//       p0_001: 84,
//       p0_01: 84,
//       p0_1: 84,
//       p1: 84,
//       p2_5: 84,
//       p10: 90,
//       p25: 98,
//       p50: 101,
//       p75: 101,
//       p90: 102,
//       p97_5: 102,
//       p99: 102,
//       p2_5: 71231,
//       p10: 85439,
//       p25: 90751,
//       p50: 93439,
//       p75: 94591,
//       p90: 95103,
//       p97_5: 96255,
//       p99: 96255,
//       p99_9: 96255,
//       p99_99: 96255,
//       p99_999: 96255
//     }
//   }