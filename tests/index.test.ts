import Vue from 'vue';
import TypedVuePlugin, { TypedVue, RecordPropsDefinition } from '../lib/index';
import { expectType } from 'tsd';

Vue.use(TypedVuePlugin);

type Value<Obj, K extends keyof Obj> = Obj[K];

describe('test', () => {
  test('infer all', () => {
    const ctor = TypedVue.typedExtend({
      props: {
        str: String,
      },
      data() {
        return {
          value: 10,
          localStr: this.$props.str,
        };
      },
      computed: {
        _double(): number {
          return 2 * this.$data.value;
        },
      },
    });

    const vm = new ctor({
      propsData: {
        str: 'hoge',
      },
    });

    // check
    expectType<string>(vm.$props.str);
    expect(vm.$props.str).toBe('hoge');

    expectType<number>(vm.$data.value);
    expect(vm.$data.value).toBe(10);

    expectType<string>(vm.$data.localStr);
    expect(vm.$data.localStr).toBe('hoge');

    expectType<number>(vm._double);
    expect(vm._double).toBe(20);
  });

  test('declare interface', () => {
    interface IProps {
      str: string;
      date: Date;
      obj: {
        a: number;
        b: string;
        c: Array<number>;
      }
    }

    interface IData {
      value: number;
      localStr: string;
    }

    const ctor = TypedVue.typedExtend({
      props: {
        str: String,
        date: Date,
        obj: { type: Object, default: () => ({ a: 0, b: 'empty', c: [1, 2, 3] }) },
      } as RecordPropsDefinition<IProps>,
      data(): IData {
        return {
          value: 10,
          localStr: this.$props.str,
        };
      },
      computed: {
        _mergeValue(): number {
          return this.$props.obj.a + this.$data.value;
        },
      },
    });

    const vm = new ctor({
      propsData: {
        str: 'hoge',
        date: new Date('2020-02-01T00:00:00+0000'),
      },
    });

    // check
    expectType<string>(vm.$props.str);
    expect(vm.$props.str).toBe('hoge');

    expectType<Date>(vm.$props.date);
    expect(vm.$props.date.toUTCString()).toBe('Sat, 01 Feb 2020 00:00:00 GMT');

    type tObj = Value<IProps, 'obj'>;
    expectType<tObj>(vm.$props.obj);
    expect(vm.$props.obj.a).toBe(0);
    expect(vm.$props.obj.b).toBe('empty');
    expect(vm.$props.obj.c).toEqual([1, 2, 3]);

    expectType<number>(vm.$data.value);
    expect(vm.$data.value).toBe(10);

    expectType<string>(vm.$data.localStr);
    expect(vm.$data.localStr).toBe('hoge');

    expectType<number>(vm._mergeValue);
    expect(vm._mergeValue).toBe(10);
  });
});
