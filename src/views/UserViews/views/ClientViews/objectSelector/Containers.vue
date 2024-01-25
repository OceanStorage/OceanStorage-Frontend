<template>
    <div class="container" v-if="openedContainerId==-1">
        <div class="resource-card">
            <div class="header">
                <div class="title">容器列表<span style="color: #8f9298; font-size: 15px;">（已加载{{ itemList.length
                }}条{{ searchKeyWord.trim() != '' ? `，筛选出 ${searchedItemList.length} 条` : "" }}）</span>
                </div>
                <div class="operation">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="searchKeyWord" placeholder="搜索容器" size="small" />
                    </span>
                </div>
            </div>
            <el-auto-resizer class="content" style="height: calc(50vh)">
                <template #default="{ height, width }">
                    <el-table-v2 :columns="itemColumns" :data="searchKeyWord.trim() != '' ? searchedItemList : itemList"
                        :height="height" :width="width" style="width: 100%; font-size: 15px;" size="large" :row-height="60"
                        :sort-by="sortState" @column-sort="onSort">
                        <template #empty>
                            <div class="flex items-center justify-center h-100%">
                                <el-empty description="无容器" />
                            </div>
                        </template>
                    </el-table-v2>
                </template>
            </el-auto-resizer>
        </div>
    </div>
    <Resources v-if="openedContainerId!=-1" :containerId="openedContainerId" @back="openedContainerId = -1" @select="selectObject('resource', $event)"></Resources>
</template>

<script lang="jsx" setup>
import { ref, onMounted, inject, computed, defineEmits, defineProps } from "vue";
import ResourcesApi from "@/apis/ResourcesApi"
import Button from 'primevue/button'
import { useConfirm } from "primevue/useconfirm";
import moment from "moment";
import {
    ElTag,
    TableV2FixedDir,
} from 'element-plus'
import { useRouter } from "vue-router";
import { cutStr } from "@/utils/StringHelper";
import Resources from "./Resources.vue"

const emit = defineEmits(["select"])

const props = defineProps(["accept", "disableResources"])

const router = useRouter();

const rowsPerPage = ref(200);
const currentStartId = ref(undefined);

const itemList = ref([])
const permissionLevelRenderParams = {
    private: { name: "私有", type: "info" },
    free: { name: "公共读写", type: "success" },
    readable: { name: "公共读", type: "" }
}

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
        key: 'container_id',
        title: 'ID',
        dataKey: 'container_id',
        width: 180,
        sortable: true, 
    },
    {
        key: 'container_name',
        title: '容器名',
        dataKey: 'container_name',
        width: 300,
        sortable: true, 
    },
    {
        key: 'permission_level',
        title: '默认权限级别',
        dataKey: 'permission_level',
        width: 150,
        sortable: true, 
        cellRenderer: ({ rowData, rowIndex }) => (
            <>
                <ElTag style="position: absolute; top: 50%; transform: translateY(-50%);"
                    type={permissionLevelRenderParams[rowData.permission_level].type} size="large"
                    effect="dark" round>
                    {permissionLevelRenderParams[rowData.permission_level].name}
                </ElTag>
            </>
        ),
    },
    {
        key: 'container_create_time',
        title: '创建时间',
        dataKey: 'container_create_time',
        width: 250,
        sortable: true, 
        cellRenderer: ({ rowData, rowIndex }) => (
            <>
                {moment(rowData.container_create_time).format('YYYY-MM-DD HH:mm:ss')}
            </>
        ),
    },
    {
        key: 'resource_amount',
        title: '资源数量',
        dataKey: 'resource_amount',
        width: 150,
        sortable: true, 
    },
    {
        key: 'operations',
        title: '操作',
        cellRenderer: ({ rowData, rowIndex }) => (
            <>
                <Button icon="pi pi-folder-open" severity="secondary" size="small" v-show={!props.disableResources} onClick={() => openContainer(rowData.container_id)}></Button>
                <Button icon="pi pi-check-circle" severity="success" size="small" onClick={() => selectObject('container', rowData.container_id)} style="margin-left:10px;"></Button>
            </>
        ),
        width: 200,
        fixed: TableV2FixedDir.RIGHT
    },
])

const loadEnded = ref(false);
const isLoading = ref(false);

const searchKeyWord = ref("")

const confirm = useConfirm();

async function updateItemList() {
    // window.startLoading();
    isLoading.value = true;
    let results = await ResourcesApi.getContainers(currentStartId.value, rowsPerPage.value);
    if (results.length > 0) currentStartId.value = results[results.length - 1].container_id;
    if (rowsPerPage.value > results.length) {
        loadEnded.value = true;
    }
    itemList.value = itemList.value.concat(results)
    isLoading.value = false;
    // window.stopLoading();
}

onMounted(() => {
    function loadMore() {
        if (!loadEnded.value && !isLoading.value) {
            updateItemList();
        }
    }
    loadMore();
    setInterval(loadMore, 200)
})


// 打开容器
function openContainer(containerId) {
    openedContainerId.value = containerId;
}

// 搜索功能
let searchedItemList = computed(() => {
    let result = [];
    if (searchKeyWord.value.trim() != "") {
        itemList.value.forEach(item => {
            if (item.container_name.indexOf(searchKeyWord.value) != -1 || item.container_id == searchKeyWord.value) {
                result.push(item);
            }
        })
        // console.log(result);
        return result;
    } else return [];
})

const openedContainerId = ref(-1);

const selectObject = (type, id) => {
    emit("select", {type, id})
    props.accept();
}

</script>

<style lang="scss" scoped>
.container {
    div.resource-card {
        // width: 100%;
        margin: 20px auto;
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
            width: calc(100% - 80px);
        }
    }


}

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

@media screen and (max-width:1440px) {
    .container {
        div.resource-card {
            width: calc(100vw - 40px);
        }
    }
}</style>