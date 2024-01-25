<template>
    <ConfirmDialog group="quicklyCreateServiceKey" style="width: 500px;">
        <template #message="{ message }">
            <div class="sideBarForm">
                <div class="form">
                    <div class="formItem">
                        <div class="explanation">
                            {{ message.message }}
                        </div>
                    </div>
                </div>
                <TabView style="margin-top: 10px;">
                    <TabPanel header="创建新令牌">
                        <div class="formItem">
                            <div class="explanation">该操作将快速创建一个最小权限的业务令牌，以满足你的临时需求。如果你需要更多的权限，应当使用业务令牌创建向导。</div>
                        </div>
                        <div class="formItem">
                            <div class="title">有效时间</div>
                            <Dropdown v-model="quickServiceKeyForm.expireTime" :options="quickServiceKeyValidateTimeOptions"
                                optionLabel="name" placeholder="选择有效时间" style="width: 100%;" />
                        </div>
                        <Checkbox v-model="quickServiceKeyForm.rememberMe" inputId="rememberMe" :binary="true"
                            style="margin-right: 3px" />
                        <label for="rememberMe" class="ml-2"> 在此电脑上记住该令牌</label>
                    </TabPanel>
                    <TabPanel header="使用已有令牌">
                        <div class="formItem">
                            <div class="explanation">该操作将使用你提供的业务令牌进行（操作是否成功取决于你提供的业务令牌的有效性）。</div>
                        </div>
                        <div class="formItem">
                            <div class="title">业务令牌</div>
                            <span class="p-input-icon-left" style="width: 100%;">
                                <i class="pi pi-key" />
                                <InputText v-model="quickServiceKeyForm.existServiceKey" placeholder="业务令牌"
                                    style="width: 100%;" />
                            </span>
                        </div>
                        <Checkbox v-model="quickServiceKeyForm.rememberMe" inputId="rememberMe" :binary="true"
                            style="margin-right: 3px" />
                        <label for="rememberMe" class="ml-2"> 在此电脑上记住该令牌</label>
                    </TabPanel>
                </TabView>
            </div>
        </template>
    </ConfirmDialog>
    <Toast position="bottom-center" group="serviceKeyCreated">
        <template #container="{ message, closeCallback }">
            <section
                style="display: flex; flex-direction: column;background-color: #000000aa; border-radius: 10px; z-index: 100; padding: 10px;">
                <div class="content" style="margin: 10px;">
                    <div style="color: white; font-weight: bold; margin: 5px 0 15px 0;">{{ message.summary }}</div>
                    <div style="color: white; margin: 10px 0 5px 0; font-size: 30px; border: 2px solid white;">{{
                        message.key }}</div>
                    <div style="color: white; margin: 15px 0;">
                        适用范围：{{ message.security_desc }}
                    </div>
                    <div style="color: white; margin: 15px 0;">
                        过期于 {{ moment(message.expire_time).local().format("YYYY/MM/DD HH:mm:ss") }}
                    </div>
                    <div style="color: white; margin: 15px 0 0px 0;">注意，此业务令牌只会显示一次，请妥善保存。</div>
                </div>
                <div>
                    <Button label="保存到本地（建议）" text style="color: white;"
                        @click="message.copyKey(); closeCallback()"></Button>
                    <Button label="关闭卡片" text style="color: white;" @click="closeCallback()"></Button>
                </div>
            </section>
        </template>
    </Toast>
    <div class="user-container">
        <div class="top-bar">
            <Sidebar v-model:visible="topMenuSideBarVisible" :showCloseIcon="false" style="width: 150px;">
                <Button v-for="menuItem in topBarMenu" :key="menuItem.name" :label="menuItem.name"
                    :icon="`pi ${menuItem.icon}`" :severity="(currentTopBarMenu == menuItem.name) ? '' : 'secondary'" text
                    style="margin: 5px 5px; display: block" @click="changeMenuRoute(menuItem)"/>
            </Sidebar>
            <div class="left">
                <Button icon="pi pi-bars" text severity="secondary" class="topMenuToggleButton"
                    @click="topMenuSideBarVisible = true" />
                <img src="/logo.png" alt="" class="miniLogo">
            </div>
            <div class="middle">
                <Button v-for="menuItem in topBarMenu" :key="menuItem.name" :label="menuItem.name"
                    :icon="`pi ${menuItem.icon}`" :severity="(currentTopBarMenu == menuItem.name) ? '' : 'secondary'" text
                    style="margin: 0 5px;" @click="changeMenuRoute(menuItem)" />
            </div>
            <div class="right">
                <Button type="button" label="Toggle" @click="toggleAvatarMenu" aria-haspopup="true"
                    aria-controls="overlay_menu" severity="secondary" text>
                    <div class="btn" style="display:flex; align-items: center; height: 25px">
                        <Avatar :label="username?.slice(0, 1)?.toUpperCase()" class="mr-2" size="normal" style="background-color:#2196F3; color: #ffffff"/>
                        <div class="name">{{ username }}</div>
                    </div>
                </Button>
                <Menu ref="avatarMenuDom" id="overlay_menu" :model="avatarMenu" :popup="true" />
            </div>
        </div>
        <el-scrollbar class="scroll-view">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { ref, onMounted, provide, onBeforeUnmount } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { getFutureTimes } from "@/utils/Time";
import { serviceKeyDesc } from "../../utils/ServiceKeyDesc";
import UserApi from "../../apis/UserApi"
import moment from "moment"

const username = window?.userInfo?.value?.userName;

const toast = useToast();

const router = useRouter();

const topBarMenu = ref([
    {
        name: "首页",
        icon: "pi-home",
        router: "UserIndex"
    },
    {
        name: "资源",
        icon: "pi-database",
        router: "UserResources"
    },
    {
        name: "用户",
        icon: "pi-user",
        router: "UserClient"
    },
    {
        name: "商城",
        icon: "pi-shopping-cart",
        router: "UserStore"
    },
    {
        name: "帮助",
        icon: "pi-question-circle",
        router: "HelpView"
    }
])

const currentTopBarMenu = ref("首页");

const avatarMenu = ref([
    {
        label: '登出',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
            window.userInfo.value = undefined;
            setTimeout(() => {
                location.reload();
            })
        }
    }
]);
const avatarMenuDom = ref();
const toggleAvatarMenu = (event) => {
    avatarMenuDom.value.toggle(event);
};
const topMenuSideBarVisible = ref(false);

let currentMenuInterval = undefined;

onMounted(() => {
    currentMenuInterval = setInterval(getCurrentMenuItem, 500);
    checkUserLoginStatus();
})

onBeforeUnmount(() => {
    if(currentMenuInterval) clearInterval(currentMenuInterval);
})

// 通过路由判断当前页面
function getCurrentMenuItem() {
    for (let item of topBarMenu.value) {
        for (let currentRouteItem of router.currentRoute._value.matched) {
            if (item.router == currentRouteItem.name) {
                currentTopBarMenu.value = item.name;
                return;
            }
        }
    }
}

// 切换菜单路由页面
function changeMenuRoute(menuItem) {
    router.push({ name: menuItem.router });
    currentTopBarMenu.value = menuItem.name;
}

function checkUserLoginStatus() {
    if (window.userInfo.value == undefined) {
        router.replace({ name: "login" })
        window.toast({
            severity: 'info',
            summary: `登录状态已过期`,
            detail: "请重新登录",
            life: 5000
        })
    }
}

const confirm = useConfirm();
const quickServiceKeyValidateTimeOptions = ref();
const quickServiceKeyForm = ref({
    expireTime: undefined,
    name: "",
    securityParams: "",
    rememberMe: false
})

// 显示业务令牌快速创建弹窗
provide("showQuicklyCreateServiceKeyDialog", function (options) {
    quickServiceKeyValidateTimeOptions.value = getFutureTimes();
    quickServiceKeyForm.value.name = options.serviceKeyName;
    quickServiceKeyForm.value.securityParams = JSON.stringify(options.serviceKeySecurityParams);
    // 先检查浏览器中已经存储的serviceKey
    let checkKey = checkServiceKeyFromLocalStorage(options.serviceKeySecurityParams);
    if (checkKey != undefined) {
        options.callback(checkKey);
        return;
    }
    // 没有？创建一个新的
    confirm.require({
        message: options.message,
        header: `提供业务令牌以继续操作`,
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectClass: 'p-button-text p-button-secondary',
        acceptClass: 'p-button-success',
        acceptLabel: "确定，请" + options.continueOperationLabel,
        rejectLabel: '放弃操作',
        group: "quicklyCreateServiceKey",
        accept: async () => {
            if (quickServiceKeyForm.value.expireTime == undefined) {
                window.toast({
                    severity: 'warn',
                    summary: `输入不正确`,
                    detail: "由于没有选择有效时间，操作已取消",
                    life: 5000
                })
                return;
            }
            window.startLoading();
            quickServiceKeyForm.value.expireTime = quickServiceKeyForm.value.expireTime.code;
            quickServiceKeyForm.value.name = quickServiceKeyForm.value.name + quickServiceKeyForm.value.expireTime.replaceAll("/", "_").replaceAll(" ", "_").replaceAll(":", "_");
            let result = await UserApi.createNewServiceKey(quickServiceKeyForm.value);
            if (quickServiceKeyForm.value.rememberMe) {
                saveServiceKeyToLocalStorage(JSON.parse(result.security_params), result.expire_time, result.key_content);
            }

            toast.add({
                severity: 'custom', summary: '新创建的业务令牌：', key: result.key_content, expire_time: result.expire_time, security_desc: serviceKeyDesc(JSON.parse(result.security_params)), group: 'serviceKeyCreated', copyKey() {
                    let content = `${result.service_key_name}\n令牌内容：${result.key_content}\n适用范围：${serviceKeyDesc(JSON.parse(result.security_params))}\n过期于 ${moment(result.expire_time).local().format("YYYY/MM/DD HH:mm:ss")}`;
                    saveAsText(content, "业务令牌_" + result.service_key_name)
                }
            });
            options.callback(result.key_content);
            window.stopLoading();
        },
        reject: () => {

        }
    });
})

function getObjectHash(object) {
    const jsonString = JSON.stringify(object);
    const hash = jsonString.split('').reduce((acc, char) => {
        acc = ((acc << 5) - acc) + char.charCodeAt(0);
        return acc & acc;
    }, 0);
    return hash;
}

function checkServiceKeyFromLocalStorage(securityParams) {
    let hash = getObjectHash(securityParams);
    let savedHashObject = window.localStorage.getItem("oceanstorage_" + hash);
    if (savedHashObject != undefined) {
        savedHashObject = JSON.parse(savedHashObject);
        if (moment(savedHashObject.expireTime) > moment(new Date())) return savedHashObject.serviceKey;
    }
}

function saveServiceKeyToLocalStorage(securityParams, expireTime, serviceKey) {
    let hash = getObjectHash(securityParams);
    window.localStorage.setItem("oceanstorage_" + hash, JSON.stringify({
        expireTime: expireTime,
        serviceKey: serviceKey
    }))
}

function saveAsText(text, fileName) {
    let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const downloadElement = document.createElement('a')
    const href = window.URL.createObjectURL(blob)
    downloadElement.href = href
    downloadElement.download = fileName
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(href)
}

provide("serviceKeyDesc", serviceKeyDesc)

</script>

<style lang="scss" scoped>
.user-container {
    width: 100vw;
    height: 100vh;
    margin: 0;

    .top-bar {
        height: 60px;
        width: 100vw;
        border-bottom: 1px solid #e6e6ec;
        box-sizing: border-box;
        box-shadow:
            0px 0.6px 18.1px rgba(0, 0, 0, 0.017),
            0px 1.8px 50.1px rgba(0, 0, 0, 0.025),
            0px 4.2px 120.6px rgba(0, 0, 0, 0.033),
            0px 14px 400px rgba(0, 0, 0, 0.05);
        z-index: 1;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
            height: 100%;
            display: flex;
            align-items: center;
            margin: 0 6px;

            .topMenuToggleButton {
                display: none;
            }

            img.miniLogo {
                height: 38px;
                margin: 5px;
            }
        }

        .middle {}

        .right {
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-right: 5px;

            .name {
                margin: 0 9px;
                color: #64748b;
                font-size: 17px;
            }
        }

        .card {
            background: var(--surface-card);
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 1rem;
        }

        p {
            line-height: 1.75;
        }


    }

    .scroll-view {
        height: calc(100vh - 60px);
        width: 100vw;
        background-color: #fafafc;
        z-index: 0;
    }
}

.sideBarForm {
    .form {
        justify-content: space-between;
    }

}

.formItem {
    margin: 0 0 20px 0;

    .title {
        margin: 0 0 10px 0;
        color: #64748b;
        font-weight: bold;
    }
}

.formItem:last-child {
    margin: 0 10px 0 0;
}

/* 定义渐变效果的CSS样式 */
.fade-enter-from, .fade-leave-to {
  transform: translateY(20px);
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

@media screen and (max-width:1000px) {
    .user-container {
        .top-bar {
            .left {
                .topMenuToggleButton {
                    display: block;
                }
            }

            .middle {
                display: none;
            }
        }
    }
}
</style>