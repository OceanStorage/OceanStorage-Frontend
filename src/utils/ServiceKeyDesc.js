export function serviceKeyDesc(securityParams) {
    if (securityParams.level == "client") {
        return `账户级的${securityParams.range == "container" ? "容器" : "资源"}${securityParams.permission_level == "readable" ? "读取" : "读写"}权限`
    } else {
        let result = "";
        for (let item of securityParams.access) {
            result += `${item.type == "container" ? "容器" : "资源"}${item.id}${item.range == "container" ? "容器" : "资源"}级别的${item.permission_level == "readable" ? "读取" : "读写"}权限、`
        }
        return result.slice(0, result.length - 1);
    }
}