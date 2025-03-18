export class CrossFrameEventBus {
    constructor(targetWindow, targetOrigin = '*', debug = false) {
        this.targetWindow = targetWindow;
        this.targetOrigin = targetOrigin;
        this.debug = debug;
        this.listeners = new Map();
        this.handleMessage = (event) => {
            // 安全校验（示例）
            // if (event.origin !== this.targetOrigin) return;
            const { type, data, isRequest } = event.data || {};
            if (!type)
                return;
            if (this.debug) {
                console.log('[CrossFrame] Received:', event.data);
            }
            // 处理订阅事件
            if (this.listeners.has(type)) {
                this.listeners.get(type)?.forEach(cb => cb(data, event));
            }
        };
        this.initListener();
    }
    initListener() {
        window.addEventListener('message', this.handleMessage);
    }
    // 注册监听事件，并将需要执行的回调函数放入在
    on(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        this.listeners.get(eventType)?.add(callback);
        return () => this.off(eventType, callback);
    }
    emit(eventType, data) {
        this.targetWindow.postMessage({ type: eventType, data }, this.targetOrigin);
    }
    off(eventType, callback) {
        this.listeners.get(eventType)?.delete(callback);
    }
    destroy() {
        window.removeEventListener('message', this.handleMessage);
        this.listeners.clear();
    }
}
