/* eslint-disable */
<template>
  <div id="app">
    <keep-alive :include="keepAlive">
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
import * as dd from "dingtalk-jsapi";
export default {
  name: "app",
  data() {
    return {};
  },
  created() {},
  computed: {
    keepAlive() {
      return this.$store.getters.keepAlive;
    },
  },
  mounted() {},
  methods: {},
};
</script>
<style>
#app {
  /* padding-top: 47px; */
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */
}

</style>