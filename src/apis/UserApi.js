import axios from "axios"
export default{
    async getValidateMethods(){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/user/getValidateMethods',
        });
        return result.data.data
    },
    async register(data){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/user/register',
            data
        });
        return result.data.data
    },
    async login(data){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/user/login',
            data
        });
        return result.data.data
    },
    async sendValidateCode(data){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/user/sendValidateCode',
            data
        });
        return result.data.data
    },
    async verifyValidateCode(data){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/user/verifyValidateCode',
            data
        });
        return result.data.data
    },
    async changePassword(data){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/user/changePassword',
            data
        });
        return result.data.data
    },
    async checkUsername(data){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/user/checkUsername',
            data
        });
        return result.data.data
    },
    async createNewServiceKey(data){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/user/createNewServiceKey',
            data
        });
        return result.data.data
    },
    async getUserGroupInfo(data){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/user/getUserGroupInfo',
            data
        });
        return result.data.data
    },
    async getUserUsageInfo(data){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/user/getUserUsageInfo',
            data
        });
        return result.data.data
    },
    async getAllServiceKeys(data){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/user/getAllServiceKeys',
            data
        });
        return result.data.data
    },
    async deleteServiceKey(serviceKeyId){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/user/deleteServiceKey',
            data: {
                serviceKeyId
            }
        });
        return result.data.data
    },
    async getImgApiKeys(){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/resource/getImgApiKeys'
        });
        return result.data.data
    },
    async createImgApiKey(containerId){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/resource/createImgApiKey',
            data: {
                containerId: containerId
            }
        });
        return result.data.data
    },
    async deleteImgApiKey(containerId){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/resource/deleteImgApiKey',
            data: {
                containerId: containerId
            }
        });
        return result.data.data
    },
    async useGiftCard(giftCard){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/user/useGiftCard',
            data: {
                giftCard: giftCard
            }
        });
        return result.data.data
    },
}