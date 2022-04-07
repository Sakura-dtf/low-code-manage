<template>
  <div>
    <h1>欢迎你 {{username}}</h1>
  </div>
</template>

<script>
export default {
  computed: {
    username() {
      return window.localStorage.getItem("username")
    }
  }
}
</script>

<style>

</style>