<template>
    <div class="container">
        <div class="service-key-card" style="position: relative;">
            <Button label="返回用户" icon="pi pi-arrow-left" text link severity="secondary"
                style="position: absolute; padding: 5px !important; top: -45px; left: 0;"
                @click="router.replace({ name: 'UserClient' })" />
            <div class="header">
                <div class="title">访问日志
                </div>
                <div class="operation">
                    <!-- <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="searchKeyWord" placeholder="搜索访问日志" size="small" />
                    </span> -->
                </div>
            </div>
            <el-table class="content" v-if="itemList.length" :data="itemList" style="margin-top: 25px;" ref="contentTable">
                <el-table-column type="expand">
                    <template #default="scope">
                        <ApiLogInfo :id="scope.row.visit_log_id"></ApiLogInfo>
                    </template>
                </el-table-column>
                <el-table-column prop="visit_log_id" label="ID" width="160" sortable />
                <el-table-column prop="visit_type" label="类型">
                    <template #default="scope">
                        {{ visit_type_dict[scope.row.visit_type] }}
                    </template>
                </el-table-column>
                <el-table-column prop="resource_id" label="资源" sortable>
                    <template #default="scope">
                        <ObjectInfo type="resource" :id="scope.row.resource_id"></ObjectInfo>
                    </template>
                </el-table-column>
                <el-table-column prop="file_size" label="流量消耗" sortable>
                    <template #default="scope">
                        {{ formatBytes(scope.row.file_size) }}
                    </template>
                </el-table-column>
                <el-table-column prop="visit_time" label="访问时间" sortable>
                    <template #default="scope">
                        {{ moment(scope.row.visit_time).format("YYYY-MM-DD HH:mm:ss") }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="paginator" style="display: flex; justify-content: flex-end; margin-top: 20px;">
                <div class="demo-pagination-block">
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                        :page-sizes="[25, 50, 75, 100]" :small="small" :disabled="disabled" :background="background"
                        layout="total, sizes, prev, pager, next, jumper" :total="totalSize" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
            </div>
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
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import InfoApi from "../../../../../apis/InfoApi";
import ObjectInfo from "../ObjectInfo.vue";
import ApiLogInfo from "./ApiLogInfo.vue"

const confirm = useConfirm();

const toast = useToast();

const router = useRouter();

const searchKeyWord = ref("");

const itemList = ref([])

const contentTable = ref();

const visit_type_dict = {
    "upload": "上传资源",
    "download": "下载资源",
    "get": "直接访问资源"
}

onMounted(async () => {
    loadPage();
})

const currentPage = ref(1)
const pageSize = ref(25)
const totalSize = ref(0)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const loadPage = async () => {
    window.startLoading();
    let result = await InfoApi.getVisitLogByPage(pageSize.value, currentPage.value);
    totalSize.value = result.sum;
    itemList.value = result.items;
    window.stopLoading();
}

const handleSizeChange = (val) => {
    loadPage();
}
const handleCurrentChange = (val) => {
    loadPage();
}

const formatBytes = (a, b) => {
    if (0 == a) return "0 B";
    var c = 1024, d = b || 2, e = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
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