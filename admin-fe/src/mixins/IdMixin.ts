import { ComponentOptions } from 'vue'

const mixin: ComponentOptions = {
  props: {
    id: {
      type: String
    }
  },
  methods: {
    safeId (suffix: string) {
      console.log('', this._.uid)
      suffix = suffix !== undefined ? suffix : ''

      var id = this.id || this.localId || null
      if (!id) {
        return null
      }
      suffix = String(suffix).replace(/\s+/g, '_')
      return suffix ? id + '_' + suffix : id
    }
  },
  computed: {
    localId (): string | undefined {
      if (!this.id && typeof this._.uid !== 'undefined') {
        return '_ID__' + this._.uid
      }
    }
  }
}

export default mixin;
