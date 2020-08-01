<template>
  <div>
    <v-row justify="center">
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-skeleton-loader
          type="card"
          :loading="isLoading"
          transition="scale-transition"
        >
          <v-card>
            <v-hover v-slot:default="{ hover }">
              <v-img
                :src="dayItem.image"
                :lazy-src="lazySrc"
                aspect-ratio="1"
              >
                <v-fade-transition>
                  <v-overlay
                    v-if="!hasPlayed || hover"
                    absolute
                    :value="!hasPlayed || hover"
                  >
                    <v-btn
                      class="xx-large mr-n2"
                      icon
                      @click="onPreviousClick"
                      :disabled="!previousDayItem"
                    >
                      <v-icon class="xx-large">
                        mdi-skip-previous
                      </v-icon>
                    </v-btn>
                    <div class="progress-button-wrapper">
                      <v-btn
                        v-if="!isPlaying"
                        class="xxx-large"
                        icon
                        @click="onPlayClick"
                      >
                        <v-icon class="xxx-large">
                          mdi-play
                        </v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        class="xxx-large"
                        icon
                        @click="onPauseClick"
                      >
                        <v-icon class="xxx-large">
                          mdi-pause
                        </v-icon>
                      </v-btn>
                      <v-fade-transition>
                        <v-progress-circular
                          class="progress-circular-button"
                          size="100"
                          :rotate="isWaiting ? '0' : '270'"
                          :value="seek"
                          :indeterminate="isWaiting"
                        />
                      </v-fade-transition>
                    </div>
                    <v-btn
                      class="xx-large ml-n2"
                      icon
                      @click="onNextClick"
                      :disabled="!nextDayItem"
                    >
                      <v-icon class="xx-large">
                        mdi-skip-next
                      </v-icon>
                    </v-btn>
                  </v-overlay>
                </v-fade-transition>
                <v-card-text
                  class="align-self-end"
                >
                  <audio
                    ref="audio"
                    :src="dayItem.audio"
                  />
                </v-card-text>
              </v-img>
            </v-hover>
            <v-card-title>
              {{ dayItem.title }}
            </v-card-title>
            <v-card-text>
              {{ dayItem.description }}
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DayItem, generateEmptyDayItem } from '../models'
import { lazySrc } from '@/assets/imageSources'
import { Route } from 'vue-router'

@Component
export default class ReadDayItem extends Vue {
  private lazySrc: string = lazySrc
  private dayItem: DayItem = generateEmptyDayItem()
  private isLoading: boolean = false
  private hasPlayed: boolean = false
  private isPlaying: boolean = false
  private isWaiting: boolean = true
  private seek: Number = 0

  // state
  get dayItems (): DayItem[] {
    return this.$store.state.dayItems.all
  }

  get previousDayItem (): DayItem | null {
    return this.$store.state.dayItems.previous
  }

  get nextDayItem (): DayItem | null {
    return this.$store.state.dayItems.next
  }

  // lifecycle
  mounted () {
    const { id } = this.$route.params

    this.readDayItem(id)
  }

  beforeDestroy () {
    const audio = this.getAudioRef()

    audio.pause()

    this.detachAudioHandlers()
  }

  beforeRouteUpdate (to: Route, from: Route, next: Function) {
    const play = this.isPlaying || false

    this.detachAudioHandlers()
    this.readDayItem(to.params.id, play)

    next()
  }

  // handlers
  onWaiting () {
    this.isWaiting = true
  }

  onCanPlay () {
    this.isWaiting = false
  }

  onPlayClick () {
    this.getAudioRef().play()
  }

  onPlaying () {
    this.isPlaying = true
    this.hasPlayed = true
  }

  onPauseClick () {
    this.getAudioRef().pause()
  }

  onPause () {
    this.isPlaying = false
  }

  onEnded () {
    const { autoplay } = this.$store.state.transport

    if (autoplay) {
      // mark state so that player will start after skip
      this.isPlaying = true

      this.onNextClick()
    } else {
      this.isPlaying = false
      this.hasPlayed = false
      this.seek = 0
    }
  }

  onTimeUpdate () {
    const audio = this.getAudioRef()

    if (!this.isWaiting) {
      this.seek = (audio.currentTime / audio.duration) * 100
    }
  }

  onPreviousClick () {
    if (this.previousDayItem) {
      const { id } = this.previousDayItem

      this.$router.push({ name: 'readDayItem', params: { id } })
    }
  }

  onNextClick () {
    if (this.nextDayItem) {
      const { id } = this.nextDayItem

      this.$router.push({ name: 'readDayItem', params: { id } })
    }
  }

  attachAudioHandlers () {
    const audio = this.getAudioRef()

    audio.onplaying = this.onPlaying
    audio.onpause = this.onPause
    audio.onended = this.onEnded
    audio.ontimeupdate = this.onTimeUpdate
    audio.onwaiting = this.onWaiting
    audio.oncanplay = this.onCanPlay
  }

  detachAudioHandlers () {
    const audio = this.getAudioRef()

    audio.onplaying = null
    audio.onpause = null
    audio.onended = null
    audio.ontimeupdate = null
    audio.onwaiting = null
    audio.oncanplay = null
  }

  // helpers
  async readDayItem (id: string, play = false) {
    this.isLoading = true

    if (!this.dayItems.length) {
      await this.$store.dispatch('readDayItems')
    }

    try {
      this.dayItem = this.$store.getters.findDayItemById(id)
      this.$store.commit('selectDayItem', this.dayItem)

      this.$nextTick(function () {
        this.attachAudioHandlers()

        if (play) {
          this.onPlayClick()
        }
      })
    } catch (e) {
      // TODO message bus?
      console.error('Read Post Error:', e)
    }

    // reset player
    this.hasPlayed = false
    this.isPlaying = false
    this.isWaiting = true
    this.seek = 0

    this.isLoading = false
  }

  getAudioRef () {
    return (this.$refs.audio as HTMLAudioElement)
  }
}
</script>

<style lang="scss" scoped>
audio {
  width: 100%;
}

.v-btn {
  &.xx-large {
    width: 75px;
    height: 75px;
  }

  &.xxx-large {
    width: 100px;
    height: 100px;
  }
}

.v-icon {
  &.xx-large {
    font-size: 55px;
  }

  &.xxx-large {
    font-size: 80px;
  }
}

.progress-button-wrapper {
  position: relative;
  display: inline-block;

  .v-progress-circular {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
}
</style>
