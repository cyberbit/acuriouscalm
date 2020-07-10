<template>
  <div>
    <v-row>
      <template
        v-if="isLoading"
      >
        <v-col
          v-for="n in 12"
          :key="n"
          cols="6"
          sm="3"
          md="2"
        >
          <v-skeleton-loader
            type="image"
          />
        </v-col>
      </template>
      <template v-else>
        <v-col
          v-for="item in dayItems"
          :key="item.id"
          cols="6"
          sm="3"
          md="2"
        >
          <v-lazy
            min-height="120"
            transition="scale-transition"
            :options="{ threshold: 0 }"
          >
            <v-card
              :to="{ name: 'readDayItem', params: { id: item.id }}"
              exact
              hover
            >
              <v-img
                :src="item.image"
                :lazy-src="lazySrc"
                aspect-ratio="1"
              />
              <!-- <v-card-title>{{ item.title }}</v-card-title>
              <v-card-subtitle>{{ item.description }}</v-card-subtitle> -->
            </v-card>
          </v-lazy>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { lazySrc } from '@/assets/imageSources'

@Component
export default class Calendar extends Vue {
  private isLoading: boolean = true
  private lazySrc: string = lazySrc

  get dayItems () {
    return this.$store.state.dayItems.all
  }

  mounted () {
    this.readDayItems()
  }

  async readDayItems () {
    this.isLoading = true

    if (!this.dayItems.length) {
      await this.$store.dispatch('readDayItems')
    }

    this.isLoading = false
  }
}
</script>

<style lang="scss">

</style>
