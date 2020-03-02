import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

import { DayItem } from '@/models'
import { RootState } from '@/types'
import dayItemsApi from '@/api/DayItemsApi'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
    dayItems: []
  },
  mutations: {
    setDayItems (store, dayItems) {
      store.dayItems = dayItems
    }
  },
  actions: {
    async readDayItems ({ commit }) {
      try {
        const dayItems = await dayItemsApi.getAll()

        commit('setDayItems', dayItems)
      } catch (err) {
        console.error('read day items error:', err)
      }
    }
  },
  modules: {
  }
}

export default new Vuex.Store<RootState>(store)
