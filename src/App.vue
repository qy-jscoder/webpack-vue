<template>
  <h1 class="title">hello</h1>
  <h2>{{a}}</h2>
  <el-button @click="a++" type="primary">点击加一</el-button>
  <ul>
    <li><router-link to="/home">Home</router-link></li>
    <li><router-link to="/about">About</router-link></li>
  </ul>
  <router-view></router-view>
</template>
<script setup="app">
import {ref} from 'vue'
const a=ref(0)
</script>
<style scoped>
.title {
  color: yellow;
}
</style>