import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

import { RootState } from '@/types'
import dayItemsApi from '@/api/DayItemsApi'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
    dayItems: {
      all: [],
      selected: null
    }
  },
  getters: {
    isDayItemsLoaded: (state) => {
      return state.dayItems.all.length > 0
    },
    findDayItemById: (state) => (id: string) => {
      return state.dayItems.all.find(v => v.id === id)
    }
  },
  mutations: {
    setDayItems (state, dayItems) {
      state.dayItems.all = dayItems
    },

    selectDayItem (state, dayItem) {
      state.dayItems.selected = dayItem
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
