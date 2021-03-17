import  { Module } from 'vuex'
import RootStateTypes from './interface'
import UserModuleTypes from '../user/interface'

const userModule : Module<RootStateTypes,UserModuleTypes> = {
  namespaced:process.env.NODE_ENV !== 'production',
  state:{
    userName:'',
    psd:'',
    count: 0,
    token:'123'
  },
  mutations: {
    SET_USERNAME: (state, username) => {
      state.userName = username
    },
    SET_PSD: (state, psd) => {
      state.psd = psd
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INCREASE(state) {
        state.count++
    },
    SET_REDUCE(state) {
        state.count--
    }
  },
  actions: {
    SetOrther({ commit }, orthername) {
      commit('SET_ORTHERNAME', orthername)
    }
  }
}

export default userModule;
