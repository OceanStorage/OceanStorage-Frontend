export function cutStr(str, len){
    str = str.length > len ? str.slice(0, len) + "..." : str;
    return str;
}