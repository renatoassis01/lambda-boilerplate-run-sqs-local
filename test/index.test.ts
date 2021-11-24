import test from 'ava';
import lambdaTester = require('lambda-tester');
import { postMessage } from '../src/index';

test('test for lambda handler', async t => {
    await lambdaTester(postMessage)
        .event({})
        .expectResult(result => {
            t.is(result.statusCode, 200);
            t.not(result.body, undefined);
        });
});
