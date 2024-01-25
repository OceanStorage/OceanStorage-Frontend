<template>
    <div class="main-wrapper">
        <ConfirmDialog group="globalDialog"></ConfirmDialog>
        <Toast position="top-center" group="global" />
        <Toast position="center" group="loading" :pt="{
            root: { class: `loadingWrapper${isLoading ? ' isLoading' : ''}` }
        }" class="loadingToast">
            <template #container="{ message, closeCallback }">
                <section class="loadingInnerWrapper" style="border-radius: 10px; background-color: #000000dd;">
                    <img src="/logo-white.png" alt="">
                </section>
            </template>
        </Toast>
        <el-scrollbar height="100vh">
            <router-view />
        </el-scrollbar>
    </div>
</template>

<script setup>
import { ref, provide, watch, onMounted } from "vue";
import 'primeicons/primeicons.css'
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from 'vue-router';

const confirm = useConfirm();

const router = useRouter();

// 全局userinfo注册
let userInfo = ref(undefined);
let cachedUserInfo = window.localStorage.getItem("OceanStorageUserAuth");
if (cachedUserInfo != undefined) {
    userInfo.value = JSON.parse(cachedUserInfo);
}
window.userInfo = userInfo;
watch(() => userInfo, (newValue, oldValue) => {
    if (userInfo.value != undefined) {
        window.localStorage.setItem("OceanStorageUserAuth", JSON.stringify(userInfo.value));
    } else {
        window.localStorage.removeItem("OceanStorageUserAuth");
    }
}, { deep: true })


// 全局toast注册
const toast = useToast();
window.toast = (info) => {
    let routerExclusivePath = [
        "login", "register"
    ]
    if (info.summary.indexOf("401") != -1 && !routerExclusivePath.includes(router.currentRoute.value.name)) {
        confirm.require({
            group: 'globalDialog',
            message: '在请求API时发生了鉴权错误，是否重新登录账号？',
            header: '重新登录',
            icon: 'pi pi-info-circle',
            acceptLabel:"是",
            rejectLabel:"否",
            accept: () => {
                window.localStorage.removeItem("OceanStorageUserAuth");
                window.userInfo.value = undefined;
                router.replace({name: "login"});
            },
            reject: () => {
            }
        });
    }
    toast.add({ ...info, group: "global" });
}

// 全局loading注册
let isLoading = ref(false);
onMounted(() => {
    toast.add({ severity: 'custom', group: "loading" });
})
window.startLoading = () => {
    isLoading.value = true;
}
window.stopLoading = () => {
    setTimeout(() => {
        isLoading.value = false;
    }, 100)
}

if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
  // 当前设备是移动设备
  console.log("当前设备是移动设备");
  router.replace({name: "deviceNotSupported"})
}

</script>

<style lang="scss">
body {
    margin: 0;
}

.main-wrapper {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    overflow-y: auto;
}

.loadingWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px !important;
    height: 100px;
    min-width: 100px;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
    transition-property: opacity, transform;
    transition-duration: .3s;
    transition-timing-function: cubic-bezier(0.000, 0.675, 0.665, 1.150);
    z-index: 1000;

    .loadingInnerWrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100px;

        img {
            height: 60%;
            animation: gelatine 0.5s infinite;
        }
    }
}

.loadingWrapper.isLoading {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}


@keyframes gelatine {

    from,
    to {
        transform: scale(1, 1);
    }

    25% {
        transform: scale(0.9, 1.1);
    }

    50% {
        transform: scale(1.1, 0.9);
    }

    75% {
        transform: scale(0.95, 1.05);
    }
}</style>
