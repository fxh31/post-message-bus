# 使用指南

## 安装

```bash
npm install post-message-simple-bus
```

## 基本使用

### 初始化事件总线

**主项目：**

> 主项目地址：http://localhost:5200/。

```js
import { CrossFrameEventBus } from 'post-message-simple-bus';

const iframe = document.querySelector(`#iframeContainer`);
const iframeWindow = iframe.contentWindow;

const mainBus = new CrossFrameEventBus(
  iframeWindow, // 指定接收端端口（window）
  'http://localhost:5201/', // 子项目域名（*：通配符）
  true, // 开启调试模式
)
```

**子项目：**

```js
import { CrossFrameEventBus } from 'post-message-simple-bus';

const mainBus = new CrossFrameEventBus(
  window.parent, // 指定接收端端口（window）
  'http://localhost:5201/', // 子项目域名（*：通配符）
  true, // 开启调试模式
)
```

### 接收消息

监听对应事件的返回值。

```js
mainBus.on('test_event', (res) => {
  console.log('res', res); // test
})
```

### 发送消息

向监听了该事件的子项目发送消息。

```js
mainBus.emit('test_event', { name: 'test' })
```

