export function getFutureTimes() {
    const currentTime = new Date();
  
    // 计算未来时间
    const futureTimes = [
        {
            code: new Date(currentTime.getTime() + 10 * 60 * 1000),
            name: "10分钟"
        },
        {
            code: new Date(currentTime.getTime() + 30 * 60 * 1000),
            name: "30分钟"
        },
        {
            code: new Date(currentTime.getTime() + 2 * 60 * 60 * 1000),
            name: "2小时"
        },
        {
            code: new Date(currentTime.getTime() + 8 * 60 * 60 * 1000),
            name: "8小时"
        },
        {
            code: new Date(currentTime.getTime() + 24 * 60 * 60 * 1000),
            name: "24小时"
        },
        {
            code: new Date(currentTime.getTime() + 3 * 24 * 60 * 60 * 1000),
            name: "3天"
        },
        {
            code: new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000),
            name: "7天"
        },
        {
            code: new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000),
            name: "30天"
        },
        {
            code: new Date(currentTime.getTime() + 60 * 24 * 60 * 60 * 1000),
            name: "60天"
        },
        {
            code: new Date(currentTime.getTime() + 180 * 24 * 60 * 60 * 1000),
            name: "180天"
        },
        {
            code: new Date(currentTime.getTime() + 365 * 24 * 60 * 60 * 1000),
            name: "1年"
        },
        {
            code: new Date(currentTime.getTime() + 3* 365 * 24 * 60 * 60 * 1000),
            name: "3年"
        },
        {
            code: new Date("2099/12/31 23:59:59"),
            name: "至本世纪末"
        }
    ];
  
    // 格式化时间为 yyyy/MM/dd HH:mm:ss
    const formattedTimes = futureTimes.map(item => {
        let time = item.code;
        const year = time.getFullYear();
        const month = `${time.getMonth() + 1}`.padStart(2, '0');
        const day = `${time.getDate()}`.padStart(2, '0');
        const hours = `${time.getHours()}`.padStart(2, '0');
        const minutes = `${time.getMinutes()}`.padStart(2, '0');
        const seconds = `${time.getSeconds()}`.padStart(2, '0');
      
        return {
            code: `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`,
            name: item.name
        };
    });
  
    return formattedTimes;
}