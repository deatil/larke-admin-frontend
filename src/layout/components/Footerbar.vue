<template>
  <div class="footerbar">
    <span class="copyright">Copyright @ {{ systemTitle }} v{{ systemVersion }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Footer',
  computed: {
    ...mapGetters([
      'systemTitle',
      'systemVersion'
    ])
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.footerbar {
  height: 35px;
  line-height: 35px;
  padding: 0 15px;
  color: #83878c;
  font-size: 14px;
  background: #fff;
  border-top: 1px solid #d8dce5;
  -webkit-box-shadow: 3px 1px 0 0 rgba(0, 0, 0, 0.12), 3px 0 0 0 rgba(0, 0, 0, 0.04);
  box-shadow: 3px 1px 0 0 rgba(0, 0, 0, 0.12), 3px 0 0 0 rgba(0, 0, 0, 0.04);
}
</style>
