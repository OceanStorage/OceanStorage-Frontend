<template>
    <div class="index-container">
        <ConfirmDialog group="deleteContainerForm">
            <template #message="{ message }">
                <div style="line-height: 200%;">
                    <div style="color: red">{{ message.message }}</div>
                    <div>尽管与其关联的业务令牌将不受影响，但你的数据很宝贵。我们仍然建议你只是停止使用该容器，而不是删除它。</div>
                    <span>如果你清楚自己在做什么，并且明白此操作可能带来的后果，请确认：</span>
                    <div class="p-input-icon-left" style="margin-top: 10px;">
                        <i class="pi pi-trash" />
                        <InputText v-model="deleteContainerConfirmInput" placeholder="请输入要删除的容器名" style="width: 100%;" />
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <ConfirmDialog group="editContainerForm">
            <template #message="{ message }">
                <div class="sideBarForm">
                    <div class="form">
                        <div class="formItem">
                            <div class="title">容器名</div>
                            <InputText v-model="containerEditForm.containerName" type="text" placeholder="输入容器名"
                                style="width: calc(100% - 10px);" />
                        </div>
                        <div class="formItem">
                            <div class="title">默认权限级别</div>
                            <SelectButton v-model="containerEditForm.permissionLevel" :options="permissionLevelOptions"
                                optionLabel="title" optionValue="value" :allowEmpty="false" />
                        </div>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<script setup>
import { ref, provide } from "vue";
import { cutStr } from "../../../utils/StringHelper";
import { useConfirm } from "primevue/useconfirm";
import ResourcesApi from "../../../apis/ResourcesApi"

const confirm = useConfirm();


// 删除容器弹窗
const deleteContainerConfirmInput = ref("");

function showDeleteContainerDialog(container, cb) {
    confirm.require({
        message: `注意：此操作无法撤销，并且你将永久失去其下的全部 ${container.resource_amount} 个资源。`,
        containerName: container.container_name,
        header: `确定要删除容器 ${cutStr(container.container_name, 20)}(ID:${container.container_id}) 吗？`,
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectClass: 'p-button-text p-button-secondary',
        acceptClass: 'p-button-danger',
        acceptLabel: '确定，请继续',
        rejectLabel: '取消',
        group: "deleteContainerForm",
        accept: async () => {
            window.startLoading();
            if (deleteContainerConfirmInput.value == container.container_name) {
                let result = await ResourcesApi.removeContainer({ containerId: container.container_id });
                if (cb) cb(true);
                window.toast({
                    severity: 'success',
                    summary: `删除成功`,
                    detail: "已删除指定容器",
                    life: 5000
                })
            } else {
                if (cb) cb(false);
                window.toast({
                    severity: 'warn',
                    summary: `输入不正确`,
                    detail: "由于没有正确输入即将删除的容器名，操作已取消",
                    life: 5000
                })
            }
            deleteContainerConfirmInput.value = "";
            window.stopLoading();
        },
        reject: () => {
            deleteContainerConfirmInput.value = "";
        }
    });
}

provide("showDeleteContainerDialog", showDeleteContainerDialog);


// 修改容器信息弹窗
const permissionLevelOptions = [
    { title: "私有", value: "private" },
    { title: "公共读", value: "readable" },
    { title: "公共读写", value: "free" }
]
let containerEditForm = ref({
    containerName: "",
    permissionLevel: "private"
})
function showEditContainerDialog(mode, container, cb) {
    if (mode == "edit") {
        containerEditForm.value.containerName = container.container_name;
        containerEditForm.value.permissionLevel = container.permission_level;
        confirm.require({
            group: "editContainerForm",
            header: `编辑容器 ${cutStr(container.container_name, 20)}(ID:${container.container_id})`,
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            rejectClass: 'p-button-text p-button-secondary',
            acceptClass: 'p-button-primary',
            acceptLabel: '提交',
            rejectLabel: '取消',
            accept: async () => {
                window.startLoading();
                let result = await ResourcesApi.editContainerInfo({ ...containerEditForm.value, containerId: container.container_id });
                cb(true, result);
                window.toast({
                    severity: 'success',
                    summary: `修改容器信息成功`,
                    detail: `已成功修改容器 ${result.container_name}(ID:${result.container_id}) 的信息`,
                    life: 5000
                })
                containerEditForm.value = {
                    containerName: "",
                    permissionLevel: "private"
                }
                window.stopLoading();
            },
            reject: () => {

            }
        })
    } else if (mode == "new") {
        confirm.require({
            group: "editContainerForm",
            header: '新建容器',
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            rejectClass: 'p-button-text p-button-secondary',
            acceptClass: 'p-button-primary',
            acceptLabel: '提交',
            rejectLabel: '取消',
            accept: async () => {
                window.startLoading();
                let result = await ResourcesApi.createNewContainer(containerEditForm.value);
                if (cb) cb(true, result);
                window.toast({
                    severity: 'success',
                    summary: `新建容器成功`,
                    detail: `已成功新建容器 ${result.container_name}(ID:${result.container_id})`,
                    life: 5000
                })
                containerEditForm.value = {
                    containerName: "",
                    permissionLevel: "private"
                }
                window.stopLoading();
            },
            reject: () => {

            }
        })
    }

}

provide("showEditContainerDialog", showEditContainerDialog);


// 分享容器
function shareContainer(container, cb) {
    // 如果为私有
    if (row.permission_level == "private") {
        showQuicklyCreateServiceKeyDialog({
            message: "由于该容器的默认权限级别为私有，你需要一个业务令牌才能分享。",
            continueOperationLabel: "开始下载",
            serviceKeyName: `容器${row.container_id}临时读用_截至`,
            serviceKeySecurityParams: {
                level: "object",
                access: [
                    {
                        type: "container",
                        id: row.container_id,
                        range: "container",
                        permission_level: "readable"
                    }
                ]
            },
            async callback(serviceKey) {
                copyContainerShareUrl(row.container_id, serviceKey)
            }
        });
    } else {
        copyContainerShareUrl(row.container_id)
    }
}
function copyContainerShareUrl(resourceId, serviceKey) {
    // TODO：复制container分享url
    if (serviceKey != undefined) url += `?servicekey=${serviceKey}`
    navigator.clipboard.writeText(url);
    window.toast({
        severity: 'success',
        summary: `复制下载链接成功`,
        detail: `已成功复制下载链接`,
        life: 5000
    })
}
provide("shareContainer", shareContainer);

</script>

<style lang="scss" scoped>
.index-container {}

.sideBarForm {
    .form {
        display: flex;
        justify-content: space-between;

        .formItem {
            margin: 0 20px 0 0;

            .title {
                margin: 0 0 10px 0;
                color: #64748b;
                font-weight: bold;
            }
        }

        .formItem:last-child {
            margin: 0 10px 0 0;
        }
    }

}

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