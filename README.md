# Typed Vue
This can provide types to `$data` and `$props`, and cannot directly access this.

## Installation
### yarn
```
$ yarn add @wintyo/typed-vue
```

### npm
```
$ npm install --save @wintyo/typed-vue
```

## Usage
### infer all
```
import TypedVue from '@wintyo/typed-vue';

export default TypedVue.typedExtend({
  props: {
    str: String,
  },
  data() {
    return {
      value: 10,
      localStr: this.$props.str,  // you cannot access this.str
    };
  },
  computed: {
    _double(): number {
      return 2 * this.$data.value;  // you cannot access this.value
    },
  },
});
```

### declare interface
Actually, it is difficult to infer all types, especially props because props parameters of options are Real Instance, not types.  
So, I recommend you to declare interface for props and data.  
The example is shown below.  

```
import TypedVue, { RecordPropsDefinition } from '@wintyo/typed-vue';

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

export default TypedVue.typedExtend({
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
```

## Licence
MIT
