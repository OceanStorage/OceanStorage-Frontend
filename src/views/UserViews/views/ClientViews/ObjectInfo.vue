<template>
    <span>
        {{ typeDict[props.type] }} {{ info == undefined ? props.id : `${props.type == "container" ? info.container_name : info.original_name}(ID:${props.id})` }}
    </span>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, defineEmits} from "vue";
import ResourcesApi from "@/apis/ResourcesApi"
import moment from "moment";
const props = defineProps(["type", "id"]);

const info = ref();

const typeDict = {
    "resource": "资源",
    "container": "容器"
}

onMounted(async ()=>{
    info.value = await ResourcesApi.getObjectInfoById(props.type, props.id);
    if(info.value == "对象不存在") info.value = undefined;
})

</script>

<style scoped lang="scss">

</style>