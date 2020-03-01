<template>
  <div>
    <v-row>
      <template
        v-if="isLoading"
      >
        <v-col
          v-for="n in 3"
          :key="n"
          cols="3"
        >
          <v-skeleton-loader
            type="card"
          />
        </v-col>
      </template>
      <template v-else>
        <v-col
          v-for="item in dayItems"
          :key="item.id"
          cols="3"
        >
          <v-card>
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>{{ item.description }}</v-card-subtitle>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Calendar extends Vue {
  private isLoading: boolean = false

  get dayItems () {
    return this.$store.state.dayItems
  }

  mounted () {
    this.readDayItems()
  }

  async readDayItems () {
    this.isLoading = true

    await this.$store.dispatch('readDayItems')

    this.isLoading = false
  }
}
</script>

<style lang="scss">

</style>
