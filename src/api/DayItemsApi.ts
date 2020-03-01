import Vue from 'vue'
import { GetDayItemsResponse } from './responses'

const axios = Vue.$axios

export default abstract class DayItemsApi {
  static async getAll () {
    const res = await axios.get<GetDayItemsResponse>('/data.json')

    const data = res.data

    // TODO better validation
    if (data && data.length && data[0].id) {
      return res.data
    } else {
      throw new Error('invalid response')
    }
  }
}
