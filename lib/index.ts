/**
 * declare module
 */
import { VueConstructor, CombinedVueInstance } from 'vue/types/vue';
import { ComponentOptions, RecordPropsDefinition } from 'vue/types/options';

type _ExtendedVue<Instance extends Vue, Data, Methods, Computed, Props> =
  VueConstructor<CombinedVueInstance<Instance, { $data: Data }, Methods, Computed, { $props: Readonly<Props> }>>;

type _DataDef<Data, Props, V> = Data | ((this: { $props: Readonly<Props> } & V) => Data);

type _ThisTypedComponentOptionsWithRecordProps<V extends Vue, Data, Methods, Computed, Props> =
  object &
  ComponentOptions<V, _DataDef<Data, Props, V>, Methods, Computed, RecordPropsDefinition<Props>, Props> &
  ThisType<CombinedVueInstance<V, { $data: Data }, Methods, Computed, { $props: Readonly<Props> }>>;

declare module 'vue/types/vue' {
  // redefined extend method
  interface VueConstructor<V extends Vue = Vue> {
    typedExtend<Data, Methods, Computed, Props>(
      options?: _ThisTypedComponentOptionsWithRecordProps<V, Data, Methods, Computed, Props>
    ): _ExtendedVue<V, Data, Methods, Computed, Props>;
    typedExtend<_V extends Vue, Data, Methods, Computed, Props>(
      extendedVue: _ExtendedVue<_V, Data, Methods, Computed, Props>
    ): _ExtendedVue<V, Data, Methods, Computed, Props>;
    typedExtend(options?: ComponentOptions<V>): _ExtendedVue<V, {}, {}, {}, {}>;
  }
}

/**
 * export interfaces
 */
import Vue, { PluginObject } from 'vue';
import { Vue as IVue, VueConstructor as IVueConstructor } from 'vue/types/vue';

export interface ITypedVue extends IVue {
  readonly $props: {};
  readonly $data: {};
}

export { IVueConstructor, RecordPropsDefinition }

export const TypedVue = Vue as IVueConstructor<ITypedVue>;

/**
 * implement and export plugin
 */
const Plugin = {
  install(Vue) {
    const typedExtend = function (this: any, options: any) {
      const instance = this.extend(options);
      instance.typedExtend = typedExtend;
      return instance;
    }
    Vue.typedExtend = typedExtend;
  },
} as PluginObject<never>;

export default Plugin;
