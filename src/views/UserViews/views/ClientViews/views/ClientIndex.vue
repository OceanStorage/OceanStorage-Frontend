<template>
    <div class="index-container">
        <div class="lr">
            <div class="l">
                <div class="card userInfo">
                    <div class="header">
                        <div class="title">用户组信息</div>
                        <div class="operation" style="color: #7a879b">
                            到期时间： {{ moment(userGroupInfo.expire_time).format("YYYY-MM-DD HH:mm:ss") }}
                        </div>
                    </div>
                    <div class="content">
                        <div class="tagContent">
                            <div class="tit">用户组</div>
                            <div class="cnt">{{ userGroupInfo.user_group_name }}</div>
                        </div>
                        <div class="tagContent">
                            <div class="tit">单个资源大小限制</div>
                            <div class="cnt">{{ formatBytes(userGroupInfo?.permission_params?.maxSingleResourceSize) }}
                            </div>
                        </div>
                        <div class="tagContent">
                            <div class="tit">资源总大小限制</div>
                            <div class="cnt">{{ formatBytes(userGroupInfo?.permission_params?.maxTotalResourceSize) }}</div>
                        </div>
                        <div class="tagContent">
                            <div class="tit">每月流量限制</div>
                            <div class="cnt">{{ formatBytes(userGroupInfo?.permission_params?.trafficLimitPerMonth) }}</div>
                        </div>
                    </div>
                    <div class="buttons">
                        <Button label="激活账户" icon="pi pi-verified" size="small" severity="secondary" outlined
                        style="margin-right: 15px;" v-show="userGroupInfo.user_group_name == '未激活用户'" @click="activateAccount"/>
                        <Button label="管理业务令牌" icon="pi pi-key" size="small" severity="secondary" outlined
                            @click="router.replace({ name: 'ServiceKeyManage' })" />
                        <Button label="修改密码" icon="pi pi-wrench" size="small" severity="secondary" outlined
                            style="margin-left: 15px;" @click="changePassword"/>
                    </div>
                </div>
                <div class="card apiKeyInfo">
                    <div class="header">
                        <div class="title">简易化 图床API</div>
                        <div class="operation"></div>
                    </div>
                    <div class="content" style="margin: 15px 0;">
                        <Message severity="info" style="margin: 0;" :closable="false">该功能来源于公益图床项目
                            OceanPic（现已停止维护，并完全迁移至此项目）。旨在为提供针对图床用途优化的API功能，通过该功能可以将一个容器模拟为一个独立的图床，并通过一个API Key进行简易访问。
                        </Message>
                        <el-table class="content" :data="imgApiKeys" style="margin-top: 25px; height: 250px;" empty-text="无数据">
                            <el-table-column prop="container_id" label="容器ID"></el-table-column>
                            <el-table-column prop="container_name" label="容器名称"></el-table-column>
                            <el-table-column prop="container_id" label="API KEY">
                                <template #default="scope">
                                    <Inplace>
                                        <template #display> 点击显示 </template>
                                        <template #content>
                                            {{ scope.row.api_key }}
                                        </template>
                                    </Inplace>
                                    
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template #default="scope">
                                    <Button icon="pi pi-trash" severity="danger" size="small" style="margin-left: 5px;"
                                        @click="deleteApiKey(scope.row)"></Button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="buttons">
                        <Button label="添加API KEY" icon="pi pi-plus" size="small" severity="secondary" outlined
                            @click="showAddApiKeyDialog" />
                    </div>
                </div>
            </div>
            <div class="r">
                <div class="card">
                    <div class="header">
                        <div class="title">用量情况</div>
                        <div class="operation">
                            <Button label="访问日志" icon="pi pi-chart-bar" text link severity="info"
                                style="margin: 0 !important; padding: 5px !important"
                                @click="router.push({ name: 'visitLogManage' })" />
                        </div>
                    </div>
                    <div class="content">
                        <Panel header="资源总大小">
                            <template #icons>
                                {{ formatBytes(userUsageInfo?.totalResourceSize) }} / {{
                                    formatBytes(userGroupInfo?.permission_params?.maxTotalResourceSize) }}
                            </template>
                            <ProgressBar
                                :value="Math.min((userUsageInfo?.totalResourceSize / userGroupInfo?.permission_params?.maxTotalResourceSize * 100).toFixed(2), 100)">
                            </ProgressBar>
                        </Panel>
                        <Panel header="当月流量（次月重置）" style="margin-top: 15px;">
                            <template #icons>
                                {{ formatBytes(userUsageInfo?.trafficOfMonth) }} / {{
                                    formatBytes(userGroupInfo?.permission_params?.trafficLimitPerMonth) }}
                            </template>
                            <ProgressBar
                                :value="Math.min((userUsageInfo?.trafficOfMonth / userGroupInfo?.permission_params?.trafficLimitPerMonth * 100).toFixed(2), 100)">
                            </ProgressBar>
                        </Panel>
                    </div>
                </div>
                <div class="card activateKey">
                    <div class="header">
                        <div class="title">礼品码兑换</div>
                        <div class="operation"></div>
                    </div>
                    <div class="content">
                        <div class="formItem">
                            <div class="title">礼品卡号</div>
                            <span class="p-input-icon-left" style="width: 100%;">
                                <i class="pi pi-gift" />
                                <InputText v-model="giftCard" placeholder="XXXX-XXXX-XXXX-XXXX" style="width: 100%;" />
                            </span>
                        </div>
                    </div>
                    <div class="buttons">
                        <Button label="兑换" icon="pi pi-check" size="small" severity="secondary" outlined
                            @click="useGiftKey" />
                    </div>
                </div>
            </div>
        </div>
        <ConfirmDialog group="addNewApiKeyForm">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div style="background-color: white; padding: 25px; width: 80vw; border-radius: 5px;  margin: 0">
                    <p style="font-weight: 700; font-size: 1.25rem; color: #374151; margin: 5px 0;">{{ message.header }}</p>
                    <Containers :accept="acceptCallback" @select="handleSelectingObject" :disableResources="true"></Containers>
                    <div style="display: flex; flex-direction: row-reverse;">
                        <Button label="取消" text severity="secondary" @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <ConfirmDialog group="deleteApiKeyForm">
            <template #message="{ message }">
                <div style="line-height: 200%;">
                    <div style="color: red">{{ message.message }}</div>
                    <span>如果你清楚自己在做什么，并且明白此操作可能带来的后果，请确认：</span>
                </div>
            </template>
        </ConfirmDialog>
        <ConfirmDialog group="changePasswordForm">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div style="background-color: white; padding: 25px; width: 600px; border-radius: 5px;  margin: 0">
                    <p style="font-weight: 700; font-size: 1.25rem; color: #374151; margin: 5px 0 20px 0;">{{ message.header }}</p>
                    <div class="formItem">
                        <div class="title">旧密码</div>
                        <span class="p-input-icon-left" style="width: 100%;">
                            <i class="pi pi-key" />
                            <InputText v-model="changePasswordFormInfo.pwd" placeholder="输入旧密码" style="width: 100%;" />
                        </span>
                    </div>
                    <div class="formItem">
                        <div class="title">新密码</div>
                        <span class="p-input-icon-left" style="width: 100%;">
                            <i class="pi pi-key" />
                            <InputText type="password" v-model="changePasswordFormInfo.newPwd" placeholder="输入新密码" style="width: 100%;" />
                        </span>
                    </div>
                    <div class="formItem">
                        <div class="title">重复新密码</div>
                        <span class="p-input-icon-left" style="width: 100%;">
                            <i class="pi pi-key" />
                            <InputText type="password" v-model="changePasswordFormInfo.rePwd" placeholder="重复输入新密码" style="width: 100%;" />
                        </span>
                    </div>
                    <div style="display: flex; flex-direction: row-reverse;">
                        <Button label="提交" severity="info" @click="handleChangePassword(rejectCallback)" style="margin-left: 10px;"></Button>
                        <Button label="取消" text severity="secondary" @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <ConfirmDialog group="activateAccountForm">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div style="background-color: white; padding: 25px; width: 600px; border-radius: 5px;  margin: 0">
                    <p style="font-weight: 700; font-size: 1.25rem; color: #374151; margin: 5px 0;">{{ message.header }}</p>
                    <Message severity="info" style="margin: 20px 0;" :closable="false">
                        我们需要至少通过以下一种方式来验证您的身份，来证明您不是机器人。激活成功后，您将被调整到标准用户组。
                    </Message>
                    <div class="formItem">
                        <div class="title">激活方式</div>
                        <SelectButton v-model="activateAccountFormInfo.method" :options="validateMethods" aria-labelledby="basic"
                            optionLabel="name" optionValue="value" :allowEmpty="false" />
                    </div>
                    <div class="formItem">
                        <div class="title">手机号/邮箱</div>
                        <InputGroup>
                            <InputText v-model="activateAccountFormInfo.content" placeholder="输入手机号/邮箱"/>
                            <Button label="发送验证码" @click="sendCode"/>
                        </InputGroup>
                    </div>
                    <div class="formItem">
                        <div class="title">验证码</div>
                        <InputText v-model="activateAccountFormInfo.code" placeholder="输入验证码" style="width: 100%;" />
                    </div>
                    <div style="display: flex; flex-direction: row-reverse;">
                        <Button label="提交" severity="info" @click="handleActivateAccount(rejectCallback)" style="margin-left: 10px;"></Button>
                        <Button label="取消" text severity="secondary" @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router';
import 'primeicons/primeicons.css'
import UserApi from "@/apis/UserApi"
import Containers from "../objectSelector/Containers.vue"
import moment from "moment"
import { useConfirm } from "primevue/useconfirm";
import { cutStr } from "@/utils/StringHelper";

const router = useRouter();

const confirm = useConfirm();

const userGroupInfo = ref({});

const userUsageInfo = ref({});

onMounted(async () => {
    window.startLoading();
    userGroupInfo.value = await UserApi.getUserGroupInfo();
    userUsageInfo.value = await UserApi.getUserUsageInfo();
    await getImgApiKeys();
    validateMethods.value = await UserApi.getValidateMethods();
    activateAccountFormInfo.value.method = validateMethods.value[0].value;
    window.stopLoading();
})

const imgApiKeys = ref([]);

const getImgApiKeys = async () => {
    imgApiKeys.value = await UserApi.getImgApiKeys();
}

function formatBytes(a, b) {
    if (a == undefined) return "Unknown"
    if (0 == a) return "0 B";
    var c = 1024, d = b || 2, e = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], f = Math.floor(Math.log(a) / Math.log(c));
    // console.log(f);
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

const showAddApiKeyDialog = async () => {
    confirm.require({
        message: `选择容器`,
        header: `选择容器`,
        group: "addNewApiKeyForm",
        accept: () => {

        },
        reject: () => {

        }
    });
}

const handleSelectingObject = async (info) => {
    if(info.type == "container"){
        // 创建API KEY
        window.startLoading();
        await UserApi.createImgApiKey(info.id);
        await getImgApiKeys();
        window.stopLoading();
    }
}

const deleteApiKey = (info) => {
    confirm.require({
        message: `注意：此操作无法撤销，并且与该API KEY关联的全部业务将受到影响。`,
        header: `确定要删除容器 ${cutStr(info.container_name, 20)}(ID:${info.container_id}) 所绑定的API KEY吗？`,
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectClass: 'p-button-text p-button-secondary',
        acceptClass: 'p-button-danger',
        acceptLabel: '确定，请继续',
        rejectLabel: '取消',
        group: "deleteApiKeyForm",
        accept: async () => {
            window.startLoading();
            await UserApi.deleteImgApiKey(info.container_id);
            await getImgApiKeys();
            window.stopLoading();
        },
        reject: () => {

        }
    });
}

const giftCard = ref("");

const useGiftKey = async () => {
    window.startLoading();
    await UserApi.useGiftCard(giftCard.value);
    window.toast({
        severity: 'success',
        summary: `兑换成功`,
        detail: "兑换成功，感谢您使用OceanStorage",
        life: 5000
    })
    userGroupInfo.value = await UserApi.getUserGroupInfo();
    userUsageInfo.value = await UserApi.getUserUsageInfo();
    giftCard.value = "";
    window.stopLoading();
}

const activateAccountFormInfo = ref({
    method: "",
    content: "",
    code: "",
    for: "activateAccount"
})

const validateMethods = ref([]);

const activateAccount = async () => {
    confirm.require({
        message: `激活账号`,
        header: `激活账号`,
        group: "activateAccountForm",
        accept: () => {

        },
        reject: () => {

        }
    });
}

async function sendCode() {
    window.startLoading();
    await UserApi.sendValidateCode({
        method: activateAccountFormInfo.value.method,
        content: activateAccountFormInfo.value.content,
        for: "activateAccount"
    })
    window.toast({
        severity: 'success',
        summary: `验证码发送成功`,
        detail: "请到对应验证方式中检查新消息",
        life: 5000
    })
    window.stopLoading();
}

const handleActivateAccount = async (cb) => {
    window.startLoading();
    await UserApi.verifyValidateCode(activateAccountFormInfo.value)
    window.toast({
        severity: 'success',
        summary: `激活成功`,
        detail: "激活成功",
        life: 5000
    })
    userGroupInfo.value = await UserApi.getUserGroupInfo();
    userUsageInfo.value = await UserApi.getUserUsageInfo();
    cb();
    window.stopLoading();
}

const changePasswordFormInfo = ref({
    pwd: "",
    rePwd: "",
    newPwd: ""
})

const changePassword = async () => {
    confirm.require({
        message: `修改密码`,
        header: `修改密码`,
        group: "changePasswordForm",
        accept: () => {

        },
        reject: () => {

        }
    });
}

const handleChangePassword = async (cb) => {
    if (changePasswordFormInfo.value.rePwd != changePasswordFormInfo.value.newPwd) {
        window.toast({
            severity: 'error',
            summary: `输入不正确`,
            detail: "两次输入密码不一致",
            life: 5000
        })
        return;
    }
    window.startLoading();
    await UserApi.changePassword({
        password: changePasswordFormInfo.value.pwd,
        new_password: changePasswordFormInfo.value.newPwd,
    })
    window.toast({
        severity: 'success',
        summary: `密码修改成功`,
        detail: "密码修改成功",
        life: 5000
    })
    window.stopLoading();
    cb();
}

</script>

<style lang="scss" scoped>
.index-container {
    div.lr {
        display: flex;
        width: 1400px;
        margin: 0 auto;
        transform: translateX(-20px);

        div.l {
            width: calc(60% - 20px);
            margin-right: 20px;
        }

        div.r {
            width: 40%;
        }

        div.card {
            width: 100%;
            background-color: white;
            margin: 20px;
            border: 1px solid #e6e6ec;
            box-sizing: border-box;
            box-shadow:
                0px 0.6px 18.1px rgba(0, 0, 0, 0.007),
                0px 1.8px 50.1px rgba(0, 0, 0, 0.01),
                0px 4.2px 120.6px rgba(0, 0, 0, 0.013),
                0px 14px 400px rgba(0, 0, 0, 0.02);
            padding: 20px 30px;

            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 30px;

                div.title {
                    font-size: 20px;
                }

                div.operation {}
            }

            .content {
                margin-top: 25px;
            }
        }
    }

    div.lr {
        div.card.userInfo {

            .content {
                display: flex;
                justify-content: space-between;
                width: 85%;

                .tagContent {
                    .tit {
                        color: #64748b;
                        margin-bottom: 10px;
                        ;
                    }

                    .cnt {
                        font-size: 24px;
                    }
                }
            }

            .buttons {
                margin-top: 20px;
            }

        }

        div.card.apiKeyInfo {

            .content {
                width: 100%;
            }
        }

        div.card.activateKey {
        }
    }
}

:deep(.p-inplace-content, .p-inplace-display) {
    font-size: 14px !important;
}

.formItem {
    margin: 0 0 20px 0;

    .title {
        margin: 0 0 10px 0;
        color: #64748b;
        font-weight: bold;
    }
}


@media screen and (max-width:1440px) {
    .index-container {
        div.lr {
            width: calc(100vw - 40px);
        }
    }
}

@media screen and (max-width:900px) {
    .index-container {
        div.lr {
            width: calc(100vw - 40px);
            flex-direction: column;
        }

        div.l,
        div.r {
            width: 100% !important;
        }
    }
}</style>