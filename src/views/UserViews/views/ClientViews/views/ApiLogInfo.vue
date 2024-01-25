<template>
    <Dialog v-model:visible="moreDialog" modal header="详情" :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p style="white-space: break-word; word-wrap: break-word; ">
            {{ moreInfo }}
        </p>
    </Dialog>
    <div style="width: 100%; display: flex; justify-content: center;" v-show="info && info.length == 0">查不到任何接口日志</div>
    <el-descriptions v-for="(item, index) in info" :title="`接口日志 #${index}`" :column="2" size="small" border style="margin-bottom: 10px;">
        <el-descriptions-item v-for="(value, key) in item" :label="key">
            <div v-if="value && value.length > 70">
                {{ cutStr(value, 70) }}
                <Button label="显示更多" icon="pi pi-external-link" text size="small" style="height:23px; transform: scale(.8);" @click="moreInfo = value; moreDialog = true" />
            </div>
            <div v-else-if="key == 'log_time'">{{ moment(value).format("YYYY-MM-DD HH:mm:ss") }}</div>
            <div v-else>{{ value }}</div>
        </el-descriptions-item>
    </el-descriptions>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, defineEmits } from "vue";
import InfoApi from "@/apis/InfoApi"
import moment from "moment";
import { cutStr } from "@/utils/StringHelper";
const props = defineProps(["id"]);

const info = ref();

const moreDialog = ref(false);
const moreInfo = ref("");

onMounted(async () => {
    info.value = await InfoApi.getApiLogByVisitLogId(props.id)
    console.log(info.value);
})

</script>

<style scoped lang="scss"></style>