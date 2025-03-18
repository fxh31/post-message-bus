type EventCallback = (data: any, event?: MessageEvent) => void;
export declare class CrossFrameEventBus {
    private targetWindow;
    private targetOrigin;
    private debug;
    private listeners;
    constructor(targetWindow: Window, targetOrigin?: string, debug?: boolean);
    private initListener;
    private handleMessage;
    on(eventType: string, callback: EventCallback): () => void;
    emit(eventType: string, data?: any): void;
    off(eventType: string, callback: EventCallback): void;
    destroy(): void;
}
export {};
