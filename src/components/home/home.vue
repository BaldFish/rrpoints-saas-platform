<template>
  <div class="home">
    <router-view class="home_main"></router-view>
  </div>
</template>

<script>
  export default {
    name: "home",
    components: {},
    data() {
      return {}
    },
    created() {
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {},
  }
</script>

<style scoped lang="stylus">
  .home {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    .home_main{
      flex: 1;
      min-width 1200px
      //margin: 0 auto;
    }
  }
</style>
