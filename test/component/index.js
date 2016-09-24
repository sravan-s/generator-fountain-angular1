const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('component');
  context.config = {get: () => context.props};
  require('../../generators/component/index');
  process.chdir('../../');
});

test(`Call this.copyTemplate 3 times without 'dir' option`, t => {
  const spy = chai.spy.on(context, 'copyTemplate');
  TestUtils.call(context, 'writing');
  expect(spy).to.have.been.called.exactly(4);
  t.true(context.copyTemplate['src/app/component.js'].length > 0);
  t.true(context.copyTemplate['src/app/component.spec.js'].length > 0);
  t.true(context.copyTemplate['src/app/component.html'].length > 0);
  t.true(context.copyTemplate['src/app/_component.scss'].length > 0);
});

test(`Not add 'src' prefix to templateUrl when modules is 'webpack'`, t => {
  context.props.modules = 'webpack';
  TestUtils.call(context, 'writing');
  t.true(context.copyTemplate['src/app/component.spec.js'].indexOf(`'app/component.html'`) > -1);
});

test(`Add 'src' prefix to file path when modules is 'systemjs'`, t => {
  context.props.modules = 'systemjs';
  TestUtils.call(context, 'writing');
  t.true(context.copyTemplate['src/app/component.spec.js'].indexOf(`'src/app/component.html'`) > -1);
});

test(`Call this.copyTemplate 3 times with 'dir' option`, t => {
  const spy = chai.spy.on(context, 'copyTemplate');
  TestUtils.call(context, 'writing', {dir: 'game'});
  expect(spy).to.have.been.called.exactly(4);
  t.true(context.copyTemplate['src/app/game/component.js'].length > 0);
  t.true(context.copyTemplate['src/app/game/component.spec.js'].length > 0);
  t.true(context.copyTemplate['src/app/game/component.html'].length > 0);
  t.true(context.copyTemplate['src/app/game/_component.scss'].length > 0);
});
