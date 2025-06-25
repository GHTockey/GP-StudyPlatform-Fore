<template>
    <div>{{ vid }}</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const vid = route.params.vid;


</script>

<style scoped lang="less"></style>