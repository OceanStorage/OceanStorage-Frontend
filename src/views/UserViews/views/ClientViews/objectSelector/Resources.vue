<template>
    <div class="container">

        <div class="resource-card">
            <div class="header">
                <div class="title">资源列表<span style="color: #8f9298; font-size: 15px;">（已加载{{ itemList.length }}条{{searchKeyWord.trim() != '' ? `，筛选出 ${searchedItemList.length} 条` : ""}}）</span></div>
                <div class="operation">
                    <Button label="返回容器列表" icon="pi pi-arrow-left" size="small" severity="secondary"
                        @click="emit('back')" style="margin-right:10px;"/>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="searchKeyWord" placeholder="搜索资源" size="small" />
                    </span>
                </div>
            </div>
            <div class="content">
                <el-auto-resizer class="content" style="height: calc(50vh)">
                    <template #default="{ height, width }">
                        <el-table-v2 :columns="itemColumns" :data="searchKeyWord.trim() != '' ? searchedItemList : itemList" 
                            :height="height" :width="width" style="width: 100%; font-size: 15px;" :sort-by="sortState" @column-sort="onSort"
                            size="large" :row-height="60">
                            <template #empty>
                                <div class="flex items-center justify-center h-100%">
                                    <el-empty description="无资源"/>
                                </div>
                            </template>
                        </el-table-v2>
                    </template>
                </el-auto-resizer>
            </div>
        </div>
    </div>
</template>

<script lang="jsx" setup>
import { ref, onMounted, computed, defineProps, defineEmits} from "vue";
import ResourcesApi from "@/apis/ResourcesApi"
import UserApi from "@/apis/UserApi"
import Button from 'primevue/button'
import moment from "moment";
import {
  ElTag,
  TableV2FixedDir,
} from 'element-plus'
import { useRouter } from "vue-router";
const props = defineProps(["containerId"]);

const emit = defineEmits(["back", "select"])

const router = useRouter();

let containerId = -1;
let uploadUrl = ref("");
let uploadHeaders = ref({});
const containerInfo = ref(undefined)
const rowsPerPage = ref(200);
const currentStartId = ref(undefined);

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
    cellRenderer: ({rowData, rowIndex}) => (
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
    cellRenderer: ({rowData, rowIndex}) => (
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
    cellRenderer: ({rowData, rowIndex}) => (
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
    cellRenderer: ({rowData, rowIndex}) => (
      <>
        {moment(rowData.last_visit_time).local().format('YYYY-MM-DD HH:mm:ss')}
      </>
    ),
  },
  {
    key: 'operations',
    title: '操作',
    cellRenderer: ({rowData, rowIndex}) => (
      <>
        <Button icon="pi pi-check-circle" severity="success" size="small" onClick={() => selectResource(rowData.resource_id)} style="margin-left:10px;"></Button>
      </>
    ),
    width: 100,
    fixed: TableV2FixedDir.RIGHT
  },
])
const loadEnded = ref(false);
const isLoading = ref(false);

const searchKeyWord = ref("")

async function updateItemList() {
    // window.startLoading();
    isLoading.value = true;
    let results = await ResourcesApi.getResourcesByContainerId(containerId, currentStartId.value, rowsPerPage.value);
    if(results.length > 0) currentStartId.value = results[results.length - 1].resource_id;
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
    if (props.containerId != undefined) {
        containerId = props.containerId;
        containerInfo.value = await ResourcesApi.getContainerInfoById(containerId);
        uploadUrl.value = await ResourcesApi.getResourceUploadUrl(containerId);
        // 确定请求头
        if(window.userInfo.value != undefined){
            uploadHeaders.value.Authorization = window.userInfo.value.token;
        }
    } else {
        //TODO: 跳转到404页面
    }
    function loadMore(){
        if (!loadEnded.value && !isLoading.value) {
            updateItemList();
        }
    }
    loadMore();
    setInterval(loadMore, 200)
    userGroupInfo.value = await UserApi.getUserGroupInfo();
})

function formatBytes(a, b) { 
    if (0 == a) return "0 B"; 
    var c = 1024, d = b || 2, e = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], f = Math.floor(Math.log(a) / Math.log(c)); 
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

// 搜索功能
let searchedItemList = computed(()=>{
    let result = [];
    if(searchKeyWord.value.trim() != ""){
        itemList.value.forEach(item => {
            if(item.original_name.indexOf(searchKeyWord.value) != -1 || item.resource_id == searchKeyWord.value){
                result.push(item);
            }
        })
        // console.log(result);
        return result;
    } else return [];
})

const selectResource = (id) => {
    emit("select", id)
}

</script>

<style lang="scss" scoped>
.container {

    div.resource-card {
        width: 100%;
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

            .el-table {
                font-size: 15px;
            }
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