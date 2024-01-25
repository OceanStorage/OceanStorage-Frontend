<template>
    <div class="securityParams" style="color: #424242">
        <div class="box" v-if="props.securityParams.level == 'client'">
            对此
            <Tag value="账户" style="margin: 0 5px;" v-show="!props.editable"></Tag>
            <Dropdown v-model="props.securityParams.level" v-show="props.editable"
                :options="[{ label: '账户', value: 'client' }, { label: '对象', value: 'object' }]" optionLabel="label"
                optionValue="value" aria-labelledby="custom" :allowEmpty="false" @update:modelValue="changeLevel">
            </Dropdown>
            的
            <span v-show="!props.editable">
                {{ props.securityParams.range == 'resource' ? '资源级' : '容器级' }} 
            </span>
            <Dropdown v-model="props.securityParams.range" v-show="props.editable"
                :options="[{ label: '资源级', value: 'resource' }, { label: '容器级', value: 'container' }]" optionLabel="label"
                optionValue="value" aria-labelledby="custom" :allowEmpty="false">
            </Dropdown>

            <span v-show="!props.editable">
                {{ permissionLevelRenderParams[props.securityParams.permission_level].name }}
            </span>
            <Dropdown v-model="props.securityParams.permission_level" v-show="props.editable"
                :options="[{ label: '读写', value: 'free' }, { label: '读', value: 'readable' }]" optionLabel="label"
                optionValue="value" aria-labelledby="custom" :allowEmpty="false">
            </Dropdown>
            权限

        </div>
        <div class="box" v-if="props.securityParams.level == 'object'">
            对以下
            <Tag value="对象" style="margin: 0 5px;" v-show="!props.editable"></Tag>
            <Dropdown v-model="props.securityParams.level" v-show="props.editable"
                :options="[{ label: '账户', value: 'client' }, { label: '对象', value: 'object' }]" optionLabel="label"
                optionValue="value" aria-labelledby="custom" :allowEmpty="false" @update:modelValue="changeLevel">
            </Dropdown>
            具有访问权限：
            <div class="boxes" style="margin: 5px 0;">
                <div class="permissionCard" v-for="(item, index) in props.securityParams.access">
                    <span>
                        <!-- <span style="margin: 0 5px;">{{ item.type == 'resource' ? '资源' : '容器' }}</span> <span
                            style="margin: 0 5px 0 0;">{{ item.id }}</span> -->
                        <ObjectInfo :type="item.type" :id="item.id"></ObjectInfo>
                        的
                        <span v-show="!props.editable" style="margin: 0 5px;"> {{ item.range == 'resource' ? '资源级' : '容器级' }}
                        </span>
                        <Dropdown v-model="props.securityParams.access[index].range" v-show="props.editable"
                            style="margin: 0 5px;"
                            :options="[{ label: '资源级', value: 'resource' }, { label: '容器级', value: 'container' }]"
                            optionLabel="label" optionValue="value" aria-labelledby="custom" :allowEmpty="false">
                        </Dropdown>

                        <span v-show="!props.editable" style="margin: 0 5px;"> {{
                            permissionLevelRenderParams[item.permission_level].name }} </span>
                        <Dropdown v-model="props.securityParams.access[index].permission_level" v-show="props.editable"
                            style="margin: 0 5px;"
                            :options="[{ label: '读写', value: 'free' }, { label: '读', value: 'readable' }]"
                            optionLabel="label" optionValue="value" aria-labelledby="custom" :allowEmpty="false">
                        </Dropdown>
                        权限
                    </span>
                    <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" v-show="props.editable"
                        @click="props.securityParams.access.splice(index, 1)" />
                </div>
                <div class="permissionCard new" v-show="props.editable" @click="openAddNewObjectForm">
                    添加对象
                </div>
            </div>
        </div>
        <div class="table">
            <!--TODO：权限表显示-->
        </div>
        <ConfirmDialog group="addNewObjectForm">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div style="background-color: white; padding: 25px; width: 80vw; border-radius: 5px;  margin: 0">
                    <p style="font-weight: 700; font-size: 1.25rem; color: #374151; margin: 5px 0;">{{ message.header }}</p>
                    <Containers :accept="acceptCallback" @select="handleSelectingObject"></Containers>
                    <div style="display: flex; flex-direction: row-reverse;">
                        <Button label="取消" text severity="secondary" @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
    </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, defineProps } from "vue";
import moment from "moment";
import { cutStr } from "@/utils/StringHelper";
import { useConfirm } from "primevue/useconfirm";
import Containers from "./objectSelector/Containers.vue"
import ObjectInfo from "./ObjectInfo.vue";

const confirm = useConfirm();

const props = defineProps(['securityParams', 'editable'])

const permissionLevelRenderParams = {
    private: { name: "私有", type: "info" },
    free: { name: "读写", type: "success" },
    readable: { name: "读", type: "" }
}

let accessItemsCache = [];

const changeLevel = (ev) => {
    if (ev == "object") {
        props.securityParams.range = undefined;
        props.securityParams.permission_level = undefined;
        props.securityParams.access = accessItemsCache;
    } else if (ev == "client") {
        accessItemsCache = props.securityParams.access;
        props.securityParams.range = "container";
        props.securityParams.permission_level = "readable";
    }
}

onMounted(() => {
    console.log(props.securityParams);
})

const openAddNewObjectForm = async () => {
    confirm.require({
        message: `添加对象`,
        header: `添加对象`,
        group: "addNewObjectForm",
        accept: () => {

        },
        reject: () => {

        }
    });
}

const handleSelectingObject = (info) => {
    props.securityParams.access.push({
        type: info.type,
        id: info.id,
        range: "resource",
        permission_level: "readable"
    })
}

</script>

<style scoped lang="scss">
div.securityParams {
    width: 100%;

}

div.boxes {
    div.permissionCard {
        border: 1px solid #f1f1f3;
        padding: 10px;
        border-radius: 5px;
        transition: all .3s;
        display: flex;
        margin: 5px 0;
        align-items: center;
        justify-content: space-between;
    }

    div.permissionCard:hover {
        border: 1px solid #dfdfdf;
        padding: 10px;
        border-radius: 5px;
        box-shadow:
            0px 4.5px 3.6px rgba(0, 0, 0, 0.007),
            0px 12.5px 10px rgba(0, 0, 0, 0.01)
    }

    div.permissionCard.new {
        justify-content: center;
        cursor: pointer;
    }
}</style>