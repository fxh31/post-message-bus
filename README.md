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

const childBus = new CrossFrameEventBus(
  window.parent, // 指定接收端端口（window）
  'http://localhost:5201/', // 子项目域名（*：通配符）
  true, // 开启调试模式
)
```

### 发送消息

向监听了该事件的子项目发送消息。

```js
mainBus.emit('test_event', { name: 'test' })
```

### 接收消息

监听对应事件的返回值。

```js
childBus.on('test_event', (res) => {
  console.log('res', res); // test
})
```

### Promise

如果有异步函数请求，可以以 promise 的形式获取返回值。

```js
// 获取请求，可带参数
async function getRequest() {
  const res = await mainBus.request('test_request', { name: 'hannah' })
}
```
```js
function fetchMock(name) {
  const res = {
    code: 200,
    data: {
      name,
      age: 18,
      address: '重庆',
    },
  }
  return Promise.resolve(res)
}

// 响应请求
childBus.onRequest('test_request', async (data, response) => {
  const res = await fetchMock(data.name)
  if (200 <= res.code < 300) {
    response(res, true)
  }
})
```

