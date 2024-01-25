<template>
    <div class="container">
        <ConfirmDialog group="createNewServiceKeyForm">
            <template #container="{ message, rejectCallback }">
                <div style="background-color: white; padding: 25px; width: 750px; border-radius: 5px;  margin: 0">
                    <p style="font-weight: 700; font-size: 1.25rem; color: #374151; margin: 5px 0;">{{ message.header }}</p>
                    <div class="form" style="margin: 25px 0;">
                        <div class="inlineItems" style="display: flex; width: 100%; justify-content: space-between;">
                            <div class="formItem">
                                <div class="title">业务令牌名</div>
                                <span class="p-input-icon-left" style="width: 100%;">
                                    <i class="pi pi-key" />
                                    <InputText v-model="newServiceKeyForm.name" placeholder="业务令牌名" style="width: 100%;" />
                                </span>
                            </div>
                            <div class="formItem">
                                <div class="title">有效时间</div>
                                <Dropdown v-model="newServiceKeyForm.expireTime" :options="newServiceKeyValidateTimeOptions"
                                    optionLabel="name" placeholder="选择有效时间" optionValue="code" style="width: 350px;" />
                            </div>
                        </div>
                        <div class="securityParams">
                            <div class="formItem">
                                <div class="title">权限参数配置</div>
                                <SecurityParams :securityParams="newServiceKeyForm.securityParams" :editable="true" style="max-height: 300px; overflow: auto;">
                                </SecurityParams>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row-reverse;">
                        <Button label="创建" @click="handleCreateNewServiceKey" style="margin-left: 15px;"></Button>
                        <Button label="取消" text severity="secondary" @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <ConfirmDialog group="deleteServiceKeyForm">
            <template #message="{ message }">
                <div style="line-height: 200%;">
                    <div style="color: red">{{ message.message }}</div>
                    <span>如果你清楚自己在做什么，并且明白此操作可能带来的后果，请确认：</span>
                </div>
            </template>
        </ConfirmDialog>
        <div class="service-key-card" style="position: relative;">
            <Button label="返回用户" icon="pi pi-arrow-left" text link severity="secondary"
                style="position: absolute; padding: 5px !important; top: -45px; left: 0;"
                @click="router.replace({ name: 'UserClient' })" />
            <div class="header">
                <div class="title">业务令牌列表<span style="color: #8f9298; font-size: 15px;">（已加载{{ itemList.length
                }}条{{ searchKeyWord.trim() != '' ? `，筛选出 ${searchedItemList.length} 条` : "" }}）</span>
                </div>
                <div class="operation">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="searchKeyWord" placeholder="搜索业务令牌" size="small" />
                    </span>
                    <Button severity="success" label="新建业务令牌" icon="pi pi-plus" size="small"
                        style="margin-left: 10px; transform: translateY(1px)" @click="handleAddNewServiceKey" />
                    <Button severity="danger" label="清理过期令牌" icon="pi pi-truck" size="small"
                    style="margin-left: 10px; transform: translateY(1px)" @click="clearExpiredServiceKeys" />
                </div>
            </div>
            <el-table class="content" v-if="itemList.length"
                :data="searchKeyWord.trim() != '' ? searchedItemList : itemList" style="margin-top: 25px;"
                :row-class-name="itemTableClassName" ref="contentTable">
                <el-table-column type="expand">
                    <template #default="scope">
                        <div style="padding: 5px 20px;">
                            <SecurityParams :securityParams="scope.row.security_params_obj"></SecurityParams>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="service_key_id" label="ID" width="160" sortable />
                <el-table-column prop="service_key_name" label="名称">
                    <template #default="scope">
                        {{ scope.row.service_key_name }} {{ moment(scope.row.expire_time) <= new Date() ? "（已过期）": "" }}
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="170" sortable>
                    <template #default="scope">
                        {{ moment(scope.row.create_time).format("YYYY-MM-DD HH:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column prop="expire_time" label="过期时间" width="170" sortable>
                    <template #default="scope">
                        {{ moment(scope.row.expire_time).format("YYYY-MM-DD HH:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <Button icon="pi pi-trash" severity="danger" size="small" style="margin-left: 5px;"
                            @click="deleteServiceKey(scope.row)"></Button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script lang="jsx" setup>
import { ref, onMounted, inject, computed } from "vue";
import ResourcesApi from "@/apis/ResourcesApi"
import moment from "moment";
import UserApi from "@/apis/UserApi"
import { useRouter } from "vue-router";
import { cutStr } from "@/utils/StringHelper";
import { getFutureTimes } from "@/utils/Time";
import { serviceKeyDesc } from "@/utils/ServiceKeyDesc";
import SecurityParams from "../SecurityParams.vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();

const toast = useToast();

const router = useRouter();

const searchKeyWord = ref("");

const itemList = ref([])

const contentTable = ref();

onMounted(async () => {
    await loadServiceKeys();
})

async function loadServiceKeys() {
    itemList.value = await UserApi.getAllServiceKeys();
    for (let item of itemList.value) {
        item.security_params_obj = JSON.parse(item.security_params);
    }
    setTimeout(() => {
        contentTable.value.sort('expire_time', 'descending')
    })
}

// 搜索功能
let searchedItemList = computed(() => {
    let result = [];
    if (searchKeyWord.value.trim() != "") {
        itemList.value.forEach(item => {
            if (item.service_key_name.indexOf(searchKeyWord.value) != -1 || item.service_key_id == searchKeyWord.value
                || item.security_params.indexOf(searchKeyWord.value) != -1) {
                result.push(item);
            }
        })
        setTimeout(() => {
            contentTable.value.sort('expire_time', 'descending')
        })
        return result;
    } else return [];
})

const itemTableClassName = ({
    row,
    rowIndex,
}) => {
    if (moment(row.expire_time) <= new Date()) {
        return 'expired-row'
    }
    return ''
}

const deleteServiceKey = async (item) => {
    confirm.require({
        message: `注意：此操作无法撤销，并且与该业务令牌关联的全部业务将受到影响。`,
        header: `确定要删除业务令牌 ${cutStr(item.service_key_name, 20)}(ID:${item.service_key_id}) 吗？`,
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectClass: 'p-button-text p-button-secondary',
        acceptClass: 'p-button-danger',
        acceptLabel: '确定，请继续',
        rejectLabel: '取消',
        group: "deleteServiceKeyForm",
        accept: async () => {
            window.startLoading();
            await UserApi.deleteServiceKey(item.service_key_id);
            await loadServiceKeys();
            window.stopLoading();
        },
        reject: () => {

        }
    });
}

const defaultServiceKey = {
    name: "",
    expireTime: "",
    securityParams: {
        level: "client",
        range: "container",
        permission_level: "readable"
    }
}

const newServiceKeyForm = ref(JSON.parse(JSON.stringify(defaultServiceKey)))

const newServiceKeyValidateTimeOptions = ref();

const handleAddNewServiceKey = () => {
    newServiceKeyValidateTimeOptions.value = getFutureTimes();
    confirm.require({
        message: `创建新的业务令牌`,
        header: `创建新的业务令牌`,
        group: "createNewServiceKeyForm",
        reject: () => {

        }
    });
}

const handleCreateNewServiceKey = async () => {
    if (newServiceKeyForm.value.name == "") {
        window.toast({
            severity: 'warn',
            summary: `输入不正确`,
            detail: "没有输入业务令牌名",
            life: 5000
        })
    } else if (newServiceKeyForm.value.expireTime == "") {
        window.toast({
            severity: 'warn',
            summary: `输入不正确`,
            detail: "没有输入有效时间",
            life: 5000
        })
    } else {
        window.startLoading();
        let rbody = JSON.parse(JSON.stringify(newServiceKeyForm.value))
        rbody.securityParams = JSON.stringify(rbody.securityParams);
        let result = await UserApi.createNewServiceKey(rbody);
        toast.add({
            severity: 'custom', summary: '新创建的业务令牌：', key: result.key_content, expire_time: result.expire_time, security_desc: serviceKeyDesc(JSON.parse(result.security_params)), group: 'serviceKeyCreated', copyKey() {
                let content = `${result.service_key_name}\n令牌内容：${result.key_content}\n适用范围：${serviceKeyDesc(JSON.parse(result.security_params))}\n过期于 ${moment(result.expire_time).local().format("YYYY/MM/DD HH:mm:ss")}`;
                saveAsText(content, "业务令牌_" + result.service_key_name)
            }
        });
        window.stopLoading();
        confirm.close();
        await loadServiceKeys();
        newServiceKeyForm.value = JSON.parse(JSON.stringify(defaultServiceKey));
    }
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

const clearExpiredServiceKeys = async () => {
    confirm.require({
        message: `此操作无法撤销，但好在并不会有什么实质性伤害（是的你没有看错）。`,
        header: `确定要删除所有过期的业务令牌吗？`,
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectClass: 'p-button-text p-button-secondary',
        acceptClass: 'p-button-success',
        acceptLabel: '确定，请继续',
        rejectLabel: '取消',
        group: "deleteServiceKeyForm",
        accept: async () => {
            window.startLoading();
            for(let item of itemList.value){
                if(moment(item.expire_time) <= new Date()){
                    await UserApi.deleteServiceKey(item.service_key_id);
                }
            }
            await loadServiceKeys();
            window.stopLoading();
        },
        reject: () => {

        }
    });

}

</script>

<style lang="scss" scoped>
.container {
    div.service-key-card {
        width: 1400px;
        margin: 60px auto;
        background-color: white;
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
    }

    div.securityParams {
        div.box {}
    }
}

@media screen and (max-width:1440px) {
    .container {
        div.service-key-card {
            width: calc(100vw - 40px);
        }
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

:deep(.el-table__row.expired-row) {
    background-color: rgb(216, 216, 216) !important;
}

:deep(.el-table__row.expired-row:hover) {
    background-color: rgb(216, 216, 216) !important;
}
</style>