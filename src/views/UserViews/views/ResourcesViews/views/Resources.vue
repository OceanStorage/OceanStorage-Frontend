<template>
    <div class="container">
        <ConfirmDialog group="deleteResourceConfirm">
            <template #message="{ message }">
                <div style="line-height: 200%;">
                    <div style="color: red">{{ message.message }}</div>
                </div>
            </template>
        </ConfirmDialog>

        <ConfirmDialog group="itemEditForm" style="width: 500px;">
            <template #message="{ message }">
                <div class="sideBarForm">
                    <div class="form">
                        <div class="formItem">
                            <div class="title">文件名</div>
                            <InputText v-model="itemEditForm.rename" type="text" placeholder="输入文件名"
                                style="width: 300px;" />
                        </div>
                    </div>
                </div>
            </template>
        </ConfirmDialog>

        <div class="containerInfo">
            <div v-if="containerInfo != undefined">
                <div class="lr">
                    <img src="/container1.png" alt="" class="folder">
                    <div class="content">
                        <div class="title">
                            {{ cutStr(containerInfo.container_name, 14) }}
                            <ElTag style="margin-left: 5px"
                                :type="permissionLevelRenderParams[containerInfo.permission_level].type" effect="dark"
                                round>
                                {{ permissionLevelRenderParams[containerInfo.permission_level].name }}
                            </ElTag>
                        </div>
                        <div class="sub">
                            共计 {{ itemList.length }} 个资源，总大小 {{ formatBytes(itemList.reduce(function (prev, curr) {
                                return prev + curr.file_size;
                            }, 0)) }}
                        </div>
                        <Button label="查看更多信息" severity="secondary" text link icon="pi pi-search-plus"
                            style="transform: translateX(-20px);" @click="showMoreInfo" />
                    </div>
                </div>
                <div class="buttons">
                    <Button label="返回容器列表" icon="pi pi-arrow-left" size="small" severity="secondary"
                        style="margin-right: 10px;" @click="router.replace({ name: 'UserResourcesContainer' })" />
                    <!-- <Button label="分享容器" icon="pi pi-share-alt" size="small" severity="success"
                        style="margin-right: 10px;" @click="handleEditContainerBtnClicked(containerInfo)"/> -->
                    <Button label="编辑容器" icon="pi pi-pencil" size="small" severity="info" style="margin-right: 10px;"
                        @click="handleEditContainerBtnClicked(containerInfo)" />
                    <Button label="删除容器" icon="pi pi-trash" size="small" severity="danger" style="margin-right: 10px;"
                        @click="confirmDeleteContainer(containerInfo)" />
                </div>
            </div>
        </div>

        <div class="resource-card">
            <div class="header">
                <div class="title">资源列表<span style="color: #8f9298; font-size: 15px;">（已加载{{ itemList.length
                }}条{{ searchKeyWord.trim() != '' ? `，筛选出 ${searchedItemList.length} 条` : "" }}）</span></div>
                <div class="operation">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="searchKeyWord" placeholder="搜索资源" size="small" />
                    </span>
                    <el-popover placement="bottom-end" :width="400" trigger="click">
                        <template #reference>
                            <Button severity="info" label="上传资源" icon="pi pi-plus" size="small"
                                style="margin-left: 10px; transform: translateY(1px)" />
                        </template>
                        <el-scrollbar max-height="500px">
                            <el-upload class="upload-demo" auto-upload drag style="margin: 10px;" :action="uploadUrl"
                                :headers="uploadHeaders" :on-success="handleUploadSuccess" :on-error="handleUploadFail"
                                multiple v-if="containerInfo != undefined">
                                <template #trigger>
                                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                    <div class="el-upload__text">
                                        选择或拖拽到此处来上传
                                    </div>
                                </template>

                                <template #tip>
                                    <div class="el-upload__tip">
                                        支持上传任何格式，大小不超过 {{
                                            formatBytes(userGroupInfo?.permission_params?.maxSingleResourceSize) }}
                                    </div>
                                </template>
                            </el-upload>
                        </el-scrollbar>
                    </el-popover>
                </div>
            </div>
            <div class="content">
                <el-auto-resizer class="content" style="min-height: 530px; height:100%; max-height: 700px">
                    <template #default="{ height, width }">
                        <el-table-v2 :columns="itemColumns" :data="searchKeyWord.trim() != '' ? searchedItemList : itemList"
                            :height="height" :width="width" style="width: 100%; font-size: 15px;" :sort-by="sortState"
                            @column-sort="onSort" size="large" :row-height="60">
                            <template #empty>
                                <div class="flex items-center justify-center h-100%">
                                    <el-empty description="无资源，点击右上角“上传资源”按钮可上传一个新资源" />
                                </div>
                            </template>
                        </el-table-v2>
                    </template>
                </el-auto-resizer>
            </div>
        </div>

        <ConfirmDialog group="showMoreInfoForm">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div style="background-color: white; padding: 25px; width: 400px; border-radius: 5px;  margin: 0">
                    <p style="font-weight: 700; font-size: 1.25rem; color: #374151; margin: 5px 0;">{{ message.header }}</p>
                    <div class="form">
                        <div class="formItem">
                            <div class="title">资源总数</div>
                            <div class="content">{{ itemList.length }}</div>
                        </div>
                        <div class="formItem">
                            <div class="title">资源总大小</div>
                            <div class="content">{{ formatBytes(itemList.reduce(function (prev, curr) {
                                return prev + curr.file_size;
                            }, 0)) }}</div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row-reverse;">
                        <Button label="关闭" text severity="secondary" @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
    </div>
</template>

<script lang="jsx" setup>
import { ref, onMounted, inject, computed } from "vue";
import ResourcesApi from "@/apis/ResourcesApi"
import UserApi from "@/apis/UserApi"
import { useConfirm } from "primevue/useconfirm";
import Button from 'primevue/button'
import moment from "moment";
import { UploadFilled } from '@element-plus/icons-vue'
import {
    ElTag,
    TableV2FixedDir,
} from 'element-plus'
import { useRouter } from "vue-router";
import { cutStr } from "@/utils/StringHelper";

const showQuicklyCreateServiceKeyDialog = inject("showQuicklyCreateServiceKeyDialog");

const router = useRouter();

let containerId = -1;
let uploadUrl = ref("");
let uploadHeaders = ref({});
const containerInfo = ref(undefined)
const rowsPerPage = ref(200);
const currentStartId = ref(undefined);

const permissionLevelRenderParams = ref({
    private: { name: "私有", type: "info" },
    free: { name: "公共读写", type: "success" },
    readable: { name: "公共读", type: "" }
})
const itemList = ref([])

const sortState = ref({ key: "no", order: 'asc' });

const onSort = ({ key, order }) => {
    handleSort(key, order)
    sortState.value = { key, order };
};

const handleSort = (key, order) => {
    let ascending = (order === 'asc' ? 1 : -1);
    itemList.value = itemList.value.sort((a, b) => {
        return a[key] > b[key] ? ascending : -ascending
    })
}

const itemColumns = ref([
    {
        key: 'resource_id',
        title: 'ID',
        dataKey: 'resource_id',
        width: 180,
        sortable: true,
    },
    {
        key: 'original_name',
        title: '文件名',
        dataKey: 'original_name',
        width: 400,
        sortable: true,
    },
    {
        key: 'file_category',
        title: '文件类型',
        dataKey: 'file_category',
        width: 100,
        sortable: true,
        cellRenderer: ({ rowData, rowIndex }) => (
            <>
                {rowData.file_category != null ? rowData.file_category : '其他'}
            </>
        ),
    },
    {
        key: 'file_size',
        title: '文件大小',
        dataKey: 'file_size',
        width: 120,
        sortable: true,
        cellRenderer: ({ rowData, rowIndex }) => (
            <>
                {formatBytes(rowData.file_size)}
            </>
        )
    },
    {
        key: 'create_time',
        title: '创建时间',
        width: 200,
        sortable: true,
        cellRenderer: ({ rowData, rowIndex }) => (
            <>
                {moment(rowData.create_time).local().format('YYYY-MM-DD HH:mm:ss')}
            </>
        ),
    },
    {
        key: 'last_visit_time',
        title: '最后访问时间',
        width: 200,
        sortable: true,
        cellRenderer: ({ rowData, rowIndex }) => (
            <>
                {moment(rowData.last_visit_time).local().format('YYYY-MM-DD HH:mm:ss')}
            </>
        ),
    },
    {
        key: 'operations',
        title: '操作',
        cellRenderer: ({ rowData, rowIndex }) => (
            <>
                {/* <Button icon="pi pi-eye" severity="help" size="small"
                                    onClick={() => handlePreviewBtnClicked(rowData)} /> */}
                <Button icon="pi pi-download" severity="secondary" size="small" style="margin-left: 5px;"
                    onClick={() => handleDownloadBtnClicked(rowData)} />
                <Button icon="pi pi-share-alt" severity="success" size="small" style="margin-left: 5px;"
                    onClick={() => handleShareBtnClicked(rowData)} />
                <Button icon="pi pi-paperclip" severity="success" size="small" style="margin-left: 5px;"
                    onClick={() => handleEmbedBtnClicked(rowData)} />
                <Button icon="pi pi-pencil" severity="info" size="small" style="margin-left: 5px;"
                    onClick={() => handleRenameResourceBtnClicked(rowData)} />
                <Button icon="pi pi-trash" severity="danger" size="small" style="margin-left: 5px;"
                    onClick={() => confirmDelete(rowData)} />
            </>
        ),
        width: 250,
        fixed: TableV2FixedDir.RIGHT
    },
])
const loadEnded = ref(false);
const isLoading = ref(false);

const searchKeyWord = ref("")
const itemEditMode = ref("edit");
const itemEditForm = ref({
    rename: ""
})

const confirm = useConfirm();

async function updateItemList() {
    // window.startLoading();
    isLoading.value = true;
    let results = await ResourcesApi.getResourcesByContainerId(containerId, currentStartId.value, rowsPerPage.value);
    if (results.length > 0) currentStartId.value = results[results.length - 1].resource_id;
    if (rowsPerPage.value > results.length) {
        loadEnded.value = true;
    }
    itemList.value = itemList.value.concat(results)
    isLoading.value = false;
    // window.stopLoading();
}

const userGroupInfo = ref({});

onMounted(async () => {
    // 检查router的params参数
    if (router.currentRoute._value.query.containerId != undefined) {
        containerId = router.currentRoute._value.query.containerId;
        containerInfo.value = await ResourcesApi.getContainerInfoById(containerId);
        uploadUrl.value = await ResourcesApi.getResourceUploadUrl(containerId);
        // 确定请求头
        if (window.userInfo.value != undefined) {
            uploadHeaders.value.Authorization = window.userInfo.value.token;
        }
    } else {
        //TODO: 跳转到404页面
    }
    function loadMore() {
        if (!loadEnded.value && !isLoading.value) {
            updateItemList();
        }
    }
    loadMore();
    setInterval(loadMore, 200)
    userGroupInfo.value = await UserApi.getUserGroupInfo();
})

function confirmDelete(row) {
    confirm.require({
        message: `注意：此操作无法撤销，建议你先做好数据备份。`,
        containerName: row.container_name,
        header: `确定要删除资源 ${cutStr(row.original_name, 20)}(ID:${row.resource_id}) 吗？`,
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectClass: 'p-button-text p-button-secondary',
        acceptClass: 'p-button-danger',
        acceptLabel: '确定，请继续',
        rejectLabel: '取消',
        group: "deleteResourceConfirm",
        accept: async () => {
            window.startLoading();
            let result = await ResourcesApi.deleteResource(row.resource_id);
            for (let i = 0; i < itemList.value.length; i++) {
                if (itemList.value[i].resource_id == row.resource_id) {
                    itemList.value.splice(i, 1);
                }
            }
            window.toast({
                severity: 'success',
                summary: `删除成功`,
                detail: "已删除指定资源",
                life: 5000
            })
            window.stopLoading();
        },
        reject: () => {
        }
    });
}

function handleRenameResourceBtnClicked(row) {
    itemEditMode.value = "edit";
    showRenameResourceDialog(row);
    itemEditForm.value.rename = row.original_name.slice(0, row.original_name.indexOf(row.file_ext));
}

function showRenameResourceDialog(row) {
    confirm.require({
        group: "itemEditForm",
        header: `重命名资源 ${cutStr(row.original_name, 20)}(ID:${row.resource_id})`,
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectClass: 'p-button-text p-button-secondary',
        acceptClass: 'p-button-primary',
        acceptLabel: '提交',
        rejectLabel: '取消',
        accept: async () => {
            window.startLoading();
            let result = await ResourcesApi.renameResource(itemEditForm.value, row.resource_id);
            // console.log(result);
            for (let i = 0; i < itemList.value.length; i++) {
                if (itemList.value[i].resource_id == row.resource_id) {
                    itemList.value[i].original_name = result.original_name;
                }
            }
            window.toast({
                severity: 'success',
                summary: `重命名成功`,
                detail: `已成功重命名资源 ${result.original_name}(ID:${result.resource_id})`,
                life: 5000
            })
            itemEditForm.value = {
                containerName: "",
                permissionLevel: "private"
            }
            window.stopLoading();
        },
        reject: () => {

        }
    })
}

async function handleDownloadBtnClicked(row) {
    // 如果为私有
    if (containerInfo.value.permission_level == "private") {
        showQuicklyCreateServiceKeyDialog({
            message: "由于该容器的默认权限级别为私有，你需要一个业务令牌才能使用其下的资源。",
            continueOperationLabel: "开始下载",
            serviceKeyName: `资源${row.resource_id}临时读用_截至`,
            serviceKeySecurityParams: {
                level: "object",
                access: [
                    {
                        type: "resource",
                        id: row.resource_id,
                        range: "resource",
                        permission_level: "readable"
                    }
                ]
            },
            async callback(serviceKey) {
                await download(row.resource_id, serviceKey)
            }
        });
    } else {
        await download(row.resource_id)
    }
}

async function download(resourceId, serviceKey) {
    let url = await ResourcesApi.getResourceDownloadUrlById(resourceId);
    if (serviceKey != undefined) url += `?servicekey=${serviceKey}`
    window.open(url, "_blank")
}


async function handleShareBtnClicked(row) {
    // 如果为私有
    if (containerInfo.value.permission_level == "private") {
        showQuicklyCreateServiceKeyDialog({
            message: "由于该容器的默认权限级别为私有，你需要一个业务令牌才能使用其下的资源。",
            continueOperationLabel: "复制下载链接",
            serviceKeyName: `资源${row.resource_id}临时读用_截至`,
            serviceKeySecurityParams: {
                level: "object",
                access: [
                    {
                        type: "resource",
                        id: row.resource_id,
                        range: "resource",
                        permission_level: "readable"
                    }
                ]
            },
            async callback(serviceKey) {
                await copyUrl(row.resource_id, serviceKey)
            }
        });
    } else {
        await copyUrl(row.resource_id)
    }
}

async function copyUrl(resourceId, serviceKey) {
    let url = await ResourcesApi.getResourceDownloadUrlById(resourceId);
    if (serviceKey != undefined) url += `?servicekey=${serviceKey}`
    navigator.clipboard.writeText(url);
    window.toast({
        severity: 'success',
        summary: `复制下载链接成功`,
        detail: `已成功复制下载链接`,
        life: 5000
    })
}

async function handleEmbedBtnClicked(row) {
    // 如果为私有
    if (containerInfo.value.permission_level == "private") {
        showQuicklyCreateServiceKeyDialog({
            message: "由于该容器的默认权限级别为私有，你需要一个业务令牌才能使用其下的资源。",
            continueOperationLabel: "复制嵌入链接",
            serviceKeyName: `资源${row.resource_id}临时读用_截至`,
            serviceKeySecurityParams: {
                level: "object",
                access: [
                    {
                        type: "resource",
                        id: row.resource_id,
                        range: "resource",
                        permission_level: "readable"
                    }
                ]
            },
            async callback(serviceKey) {
                await copyEmbedUrl(row.resource_id, serviceKey)
            }
        });
    } else {
        await copyEmbedUrl(row.resource_id)
    }
}

async function copyEmbedUrl(resourceId, serviceKey) {
    let url = await ResourcesApi.getResourceEmbedUrlById(resourceId);
    if (serviceKey != undefined) url += `?servicekey=${serviceKey}`
    navigator.clipboard.writeText(url);
    window.toast({
        severity: 'success',
        summary: `复制嵌入链接成功`,
        detail: `已成功复制嵌入链接`,
        life: 5000
    })
}


function handleUploadSuccess(evt) {
    window.toast({
        severity: 'success',
        summary: `文件${evt.data.original_name}上传成功`,
        detail: evt.message,
        life: 5000
    })
    itemList.value.unshift(evt.data);
}

function handleUploadFail(evt) {
    window.toast({
        severity: 'error',
        summary: `文件上传失败`,
        detail: evt.message,
        life: 5000
    })
}

function formatBytes(a, b) {
    if (0 == a) return "0 B";
    var c = 1024, d = b || 2, e = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

// 搜索功能
let searchedItemList = computed(() => {
    let result = [];
    if (searchKeyWord.value.trim() != "") {
        itemList.value.forEach(item => {
            if (item.original_name.indexOf(searchKeyWord.value) != -1 || item.resource_id == searchKeyWord.value) {
                result.push(item);
            }
        })
        // console.log(result);
        return result;
    } else return [];
})


// 删除容器
const showDeleteContainerDialog = inject("showDeleteContainerDialog");
function confirmDeleteContainer(row) {
    showDeleteContainerDialog(row, (success) => {
        if (success) {
            router.replace({ name: 'UserResourcesContainer' })
        }
    })
}


// 编辑容器信息
const showEditContainerDialog = inject("showEditContainerDialog");
function handleEditContainerBtnClicked(row) {
    showEditContainerDialog("edit", row, (success, result) => {
        if (success) {
            containerInfo.value = result;
        }
    });

}

const showMoreInfo = () => {
    confirm.require({
        message: '',
        header: containerInfo.value.container_name,
        group: "showMoreInfoForm",
        accept: () => {

        },
        reject: () => {

        }
    });
}

</script>

<style lang="scss" scoped>
.container {

    .containerInfo {
        width: 1400px;
        height: 80px;
        margin: 20px auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        background-color: white;
        border: 1px solid #e6e6ec;
        box-sizing: border-box;
        box-shadow:
            0px 0.6px 18.1px rgba(0, 0, 0, 0.007),
            0px 1.8px 50.1px rgba(0, 0, 0, 0.01),
            0px 4.2px 120.6px rgba(0, 0, 0, 0.013),
            0px 14px 400px rgba(0, 0, 0, 0.02);
        padding: 100px 30px 90px 30px;

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

        .lr {
            display: flex;

            img.folder {
                height: 100px;
                margin-left: 20px;
            }

            .content {
                margin-left: 35px;

                .title {
                    font-size: 26px;
                    font-weight: bold;
                }

                .sub {
                    font-size: 16px;
                    margin-top: 8px;
                    color: #64748b
                }

                .more {
                    font-size: 16px;
                    margin-top: 8px;
                    color: #64748b
                }
            }
        }

        .buttons {
            position: absolute;
            bottom: 25px;
            right: 30px;
        }
    }


    div.resource-card {
        width: 1400px;
        margin: -10px auto 20px auto;
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

        .content {
            margin-top: 25px;

            .el-table {
                font-size: 15px;
            }
        }
    }


}

.form {
    margin: 20px 0;

    .formItem {
        margin: 20px 20px 0 0;

        .title {
            margin: 0 0 10px 0;
            color: #64748b;
            font-weight: bold;
        }
    }
}

@media screen and (max-width:1440px) {
    .container {
        div.resource-card {
            width: calc(100vw - 40px);
        }
    }
}
</style>