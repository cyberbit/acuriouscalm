<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <template v-if="isPost">
        <v-btn
          :to="{ name: 'home' }"
          exact
          text
        >
          <v-icon left>
            mdi-apps
          </v-icon>
          Back to Posts
        </v-btn>
        <v-spacer />

        <v-switch
          v-model="autoplay"
          label="Autoplay"
          hide-details
        />
      </template>
      <template v-else>
        <v-toolbar-title>A Curious Calm</v-toolbar-title>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  get isPost () {
    return this.$route.matched.some(({ name }) => name === 'readDayItem')
  }

  get autoplay () {
    return this.$store.state.transport.autoplay
  }

  set autoplay (autoplay) {
    this.$store.commit('setAutoPlay', autoplay)
  }

  // lifecycle
  mounted () {
    //
  }
}
</script>
