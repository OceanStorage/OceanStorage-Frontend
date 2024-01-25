import axios from "axios"

axios.interceptors.request.use(function (request) {
    if(window.userInfo.value != undefined){
        request.headers.Authorization = window.userInfo.value.token;
    }
    return request;
}, function (error) {
    console.log(error)
    window.stopLoading();
    return new Promise(()=>{});
});


axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response) {
        window.toast({ severity: 'error', summary: `[API错误] ${error.response.data.message}`, detail: error.response.data.data, life: 5000 })
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
    window.stopLoading();
    return new Promise(()=>{});
});
