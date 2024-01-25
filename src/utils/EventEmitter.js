class EventEmitter {
    constructor() {
        // 维护事件及监听者
        this.listeners = {}
    }
    /**
     * 注册事件监听者
     * @param {String} type 事件类型
     * @param {Function} callback 回调函数
     */
    on(type, callback) {
        if (!this.listeners[type]) {  // 如果该事件类型不存在
            this.listeners[type] = [] // 为该事件类型设置数组，存放回调函数
        }
        this.listeners[type].push(callback) // 将回调函数放入该事件类型数组
    }
    /**
     * 发布事件
     * @param {String} type 事件类型
     * @param  {...any} args 参数列表，把emit传递的参数赋给回调函数
     */
    emit(type, ...args) {
        if (this.listeners[type]) { // 如果该事件类型存在
            this.listeners[type].forEach(callback => {
                callback(...args) // 调用该事件类型数组中的每一个回调函数，并传入参数
            })
        }
    }
    /**
     * 移除某个事件的一个监听者
     * @param {String} type 事件类型
     * @param {Function} callback 回调函数
     */
    off(type, callback) {
        if (this.listeners[type]) {
            // 查询传入回调函数在该事件类型数组中的下标，并将其下标用targetIndex存储
            const targetIndex = this.listeners[type].findIndex(item => item === callback)
            if (targetIndex !== -1) { // 说明该回调函数存在于事件类型数组中
                this.listeners[type].splice(targetIndex, 1) // 删除该回调函数
            }
            if (this.listeners[type].length === 0) { // 该事件类型数组为空
                delete this.listeners[type] // 删除该事件类型
            }
        }
    }
    /**
     * 移除某个事件的所有监听者
     * @param {String} type 事件类型
     */
    offAll(type) {
        if (this.listeners[type]) { // 如果该事件类型数组存在
            delete this.listeners[type] // 直接删除该事件类型
        }
    }
}

export default EventEmitter;