<template>
  <Calendar />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Calendar from '@/components/Calendar.vue'

@Component({
  components: {
    Calendar
  }
})
export default class Home extends Vue {
  //
}
</script>
