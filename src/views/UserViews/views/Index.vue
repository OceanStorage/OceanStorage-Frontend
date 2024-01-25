<template>
    <div class="index-container">
        <div class="lr">
            <div class="l">
                <div class="card userInfo">
                    <div class="header">
                        <div class="title">信息概览</div>
                        <div class="operation">
                            <Button label="管理用户信息" icon="pi pi-wallet" text link severity="info"
                                style="margin: 0 !important; padding: 5px !important" @click="router.push({name: 'UserClient'})"/>
                        </div>
                    </div>
                    <div class="content">
                        <div class="tagContent" v-if="clientInfo.userGroupInfo">
                            <div class="tit">用户组</div>
                            <div class="cnt">{{ clientInfo?.userGroupInfo[0].user_group_name }}</div>
                        </div>
                        <div class="tagContent">
                            <div class="tit">容器数量</div>
                            <div class="cnt">{{ clientInfo.containerCount }}</div>
                        </div>
                        <div class="tagContent">
                            <div class="tit">资源总量</div>
                            <div class="cnt">{{ clientInfo.resourceCount }}</div>
                        </div>
                        <div class="tagContent">
                            <div class="tit">业务令牌数量</div>
                            <div class="cnt">{{ clientInfo.serviceKeyCount }}</div>
                        </div>
                    </div>
                </div>
                <div class="card usageInfo">
                    <div class="header">
                        <div class="title">用量统计</div>
                        <div class="operation">
                            <SelectButton v-model="usageInfoViewMode" :options="['日','周','月']" aria-labelledby="basic" style="transform: scale(.85) translateX(15px);"
                            @change="loadUsageInfo" :allowEmpty="false"/>
                        </div>
                    </div>
                    <div class="content">
                        <e-charts class="chart" :option="chartOptions" autoresize />
                    </div>
                </div>
            </div>
            <div class="r">
                <div class="card siteInfo">
                    <div class="header">
                        <div class="title">站点公告</div>
                        <div class="operation"></div>
                    </div>
                    <div class="content">
                        <Accordion :activeIndex="0">
                            <AccordionTab v-for="notif in siteNotifications">
                                <template #header>
                                    <div style="display:flex; justify-content: space-between; width: 100%;">
                                        <div class="font-bold white-space-nowrap">{{ notif.notice_title }}</div>
                                        <div class="time" style="color: #64748b;">
                                            {{ moment(notif.notice_create_time).local().format('YYYY-MM-DD') }}</div>
                                    </div>
                                </template>
                                <p class="m-0" style="margin: 0;">
                                    {{ notif.notice_content }}
                                </p>
                            </AccordionTab>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router';
import 'primeicons/primeicons.css'
import InfoApi from "../../../apis/InfoApi"
import * as echarts from "echarts";                  // 全局引入echarts
import moment from "moment"

const router = useRouter();

const siteNotifications = ref([])

const clientInfo = ref({});

const visitStatistics = ref([]);

const usageInfoViewMode = ref("日");

onMounted(async () => {
    window.startLoading();
    siteNotifications.value = await InfoApi.getNotices(0, 10);
    clientInfo.value = await InfoApi.getClientInfo();
    await loadUsageInfo();
    window.stopLoading();
})

async function loadUsageInfo(){
    window.startLoading();
    visitStatistics.value = [] ;
    if(usageInfoViewMode.value == "日"){
        visitStatistics.value = await InfoApi.getVisitStatisticsByDay();
    } else if (usageInfoViewMode.value == "周"){
        visitStatistics.value = await InfoApi.getVisitStatisticsByWeek();
    } else {
        visitStatistics.value = await InfoApi.getVisitStatisticsByMonth();
    }
    window.stopLoading();
}

const chartOptions = computed(() => {
    return {
        grid: {
            x: 0,
            y: 45,
            x2: 40,
            y2: 40,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: visitStatistics.value.map(el => el.label),
            splitLine: {
                show: true,
            }

        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: "{value} GiB",
            },
        },
        series: [
            {
                data: visitStatistics.value.map(el => el.value / 1024 / 1024 / 1024),
                type: 'line',
                color: "#4bc0c0",
                lineStyle: {
                    width: 3
                },
                areaStyle: {
                    normal: {
                        color: "#b7e6e6ff"
                    }
                },
            }
        ],
        tooltip: {
            trigger: 'axis',
            valueFormatter: function (value) {
                // console.log(value);
                return formatBytes(value * 1024 * 1024 * 1024);
            }
        },
        animation: false
    }
})

function formatBytes(a, b) { 
    if (0 == a) return "0 B"; 
    var c = 1024, d = b || 2, e = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], f = Math.floor(Math.log(a) / Math.log(c)); 
    // console.log(f);
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
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
            height: 170px;

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
        }

        div.card.usageInfo {
            height: 610px;

            .content {
                width: calc(100% + 5%);
                height: 570px;
                margin: 0;
            }
        }

        ;

        div.card.siteInfo {
            height: 800px;
        }
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
}
</style>