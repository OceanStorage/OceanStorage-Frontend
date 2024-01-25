import axios from "axios"
export default{
    async getContainers(startId, rows){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/resource/getContainers',
            params:{
                startId, rows
            }
        });
        return result.data.data
    },
    async createNewContainer(data){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/resource/createNewContainer',
            data
        });
        return result.data.data
    },
    async editContainerInfo(data){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/resource/editContainerInfo',
            data
        });
        return result.data.data
    },
    async getContainerInfoById(containerId){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/resource/getContainerInfoById',
            params:{
                containerId
            }
        });
        return result.data.data
    },
    async removeContainer(data){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/resource/removeContainer',
            data
        });
        return result.data.data
    },
    async getResourcesByContainerId(containerId, startId, rows){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/resource/getResourcesByContainerId',
            params:{
                containerId, startId, rows
            }
        });
        return result.data.data
    },
    async deleteResource(resourceId){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/resource/delete/' + resourceId,
        });
        return result.data
    },
    async renameResource(data, resourceId){
        let result = await axios({
            method: 'post',
            url:  $baseUrl + '/api/resource/rename/' + resourceId,
            data
        });
        return result.data.data
    },
    async getResourceDownloadUrlById(resourceId){
        return $baseUrl + '/api/resource/download/' + resourceId
    },
    async getResourceEmbedUrlById(resourceId){
        return $baseUrl + '/api/resource/get/' + resourceId
    },
    async getResourceUploadUrl(containerId){
        return $baseUrl + '/api/resource/upload?container=' + containerId
    },
    async getObjectInfoById(type, id){
        let result = await axios({
            method: 'get',
            url:  $baseUrl + '/api/resource/getObjectInfoById',
            params:{
                type, id
            }
        });
        return result.data.data
    },
}