import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

import { RootState } from '@/types'
import dayItemsApi from '@/api/DayItemsApi'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
    dayItems: {
      all: [],
      previous: null,
      current: null,
      next: null
    },

    // TODO store settings in local storage
    transport: {
      autoplay: true
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
      state.dayItems.current = dayItem

      // TODO update to support custom playlist
      const currentIdx = state.dayItems.all.findIndex(v => v.id === dayItem.id)

      state.dayItems.previous = state.dayItems.all[currentIdx - 1] || null
      state.dayItems.next = state.dayItems.all[currentIdx + 1] || null
    },

    setAutoPlay (state, autoplay) {
      state.transport.autoplay = autoplay
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
