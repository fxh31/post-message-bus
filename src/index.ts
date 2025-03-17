type EventCallback = (data: any, event?: MessageEvent) => void;

export class CrossFrameEventBus{
  private listeners = new Map<string, Set<EventCallback>>();
  constructor(
    private targetWindow: Window,
    private targetOrigin: string = '*',
    private debug: boolean = false
  ) {
    this.initListener();
  }
  
  private initListener() {
    window.addEventListener('message', this.handleMessage);
  }
  
  private handleMessage = (event: MessageEvent) => {
    // 安全校验（示例）
    // if (event.origin !== this.targetOrigin) return;
    const { type, data, isRequest } = event.data || {};
    if (!type) return;

    if (this.debug) {
      console.log('[CrossFrame] Received:', event.data);
    }

    // 处理订阅事件
    if (this.listeners.has(type)) {
      this.listeners.get(type)?.forEach(cb => cb(data, event));
    }
  };
  // 注册监听事件，并将需要执行的回调函数放入在
  on(eventType: string, callback: EventCallback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(callback);
    
    return () => this.off(eventType, callback);
  }

  emit(eventType: string, data?: any) {
    this.targetWindow.postMessage({ type: eventType, data }, this.targetOrigin);
  }

  off(eventType: string, callback: EventCallback) {
    this.listeners.get(eventType)?.delete(callback);
  }
  
  destroy() {
    window.removeEventListener('message', this.handleMessage);
    this.listeners.clear();
  }
}
