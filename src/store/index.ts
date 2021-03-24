import { InjectionKey } from 'vue'
import { createStore, Store ,useStore as baseUseStore } from 'vuex'
import RootStateTypes,{ AllStateTypes } from './interface'
// 引入子模块
import userModule from './modules/user/user'

export const store = createStore<RootStateTypes>({
   state:{
       test:'',
       list:[],// 500 条数据存store
   },
   getters:{},
   mutations:{
    SET_LIST: (state, list) => {
        state.list = list
    },
   },
   actions:{},
   modules:{
    userModule
   }
})
export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue-store');
export function useStore< T = AllStateTypes >(){
    return baseUseStore<T>(key);
}
