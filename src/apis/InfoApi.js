import axios from "axios"
export default{
    async getNotices(first, rows){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/notice/getNotices',
            params:{
                first, rows
            }
        });
        return result.data.data
    },
    async getClientInfo(){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/info/getClientInfo'
        });
        return result.data.data
    },
    async getSiteInfo(){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/info/getSiteInfo'
        });
        return result.data.data
    },
    async getVisitStatisticsByDay(){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/info/getVisitStatisticsByDay'
        });
        return result.data.data
    },
    async getVisitStatisticsByWeek(){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/info/getVisitStatisticsByWeek'
        });
        return result.data.data
    },
    async getVisitStatisticsByMonth(){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/info/getVisitStatisticsByMonth'
        });
        return result.data.data
    },
    async getVisitLogByPage(pageSize, pageNum){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/info/getVisitLogByPage',
            params: {
                pageNum, pageSize
            }
        });
        return result.data.data
    },
    async getApiLogByVisitLogId(visitLogId){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/info/getApiLogByVisitLogId',
            params: {
                visitLogId
            }
        });
        return result.data.data
    },
}