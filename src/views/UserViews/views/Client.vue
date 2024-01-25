<template>
    <div class="index-container">
        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<script setup>
import { ref, provide } from "vue";



</script>

<style lang="scss" scoped>
.index-container {}

/* 定义渐变效果的CSS样式 */
.fade-enter-from{
    opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
.fade-enter-active {
  transition: all 0.5s ease;
}
.fade-leave-active {
   transition: all 0.2s cubic-bezier(1, 0.6, 0.6, 1);
}
</style>