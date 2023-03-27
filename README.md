# 微信支付 APIv3 Postman 脚本

微信支付 APIv3 的 [Postman](https://www.postman.com) 请求前置脚本（[Pre-Request Script](https://learning.postman.com/docs/writing-scripts/pre-request-scripts/)）。

为了帮助商户开发者快速上手，我们将脚本部署到 Postman 云工作台 [WeChat Pay Public Workspace](https://www.postman.com/wechatpay-dev/workspace/wechat-pay-public-workspace/overview)。你不用手动导入脚本，只需要将集合[《微信支付 APIv3》](https://www.postman.com/wechatpay-dev/workspace/apiv3-public-workspace/collection/3391715-85f478d8-2596-420a-9f21-53376fc6ad0a) fork 到自己的工作台，就可以在 Postman 上轻松地构造并发送微信支付 APIv3 请求了。

## 前置条件

- [Postman](https://www.postman.com/downloads/)，一款业界知名的 API 构建和使用平台。建议注册一个账户，便于使用它各种功能。
- [成为微信支付商户](https://pay.weixin.qq.com/index.php/apply/applyment_home/guide_normal)。
- [商户 API 私钥](https://wechatpay-api.gitbook.io/wechatpay-api-v3/ren-zheng/zheng-shu#shang-hu-api-si-yao)：商户申请商户API证书时，会生成商户私钥，并保存在本地证书文件夹的文件 apiclient_key.pem 中。

## 快速开始

### 步骤1：Fork 方式导入脚本

点击按钮 [![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/3391715-85f478d8-2596-420a-9f21-53376fc6ad0a?action=collection%2Ffork&collection-url=entityId%3D3391715-85f478d8-2596-420a-9f21-53376fc6ad0a%26entityType%3Dcollection%26workspaceId%3D5f619604-11ee-42a4-b148-22abec1f0611) 进入向导，如下图所示。

![fork collection step1](https://user-images.githubusercontent.com/1812516/196029034-fb5e9453-fbef-4267-94cc-8566dc008314.png)

点击 `Fork Collection` 进入下一步，填入标签 `Fork Label` 并选择目的工作台 `Workspace`。一般情况下，导入个人工作台 My Workspace 即可。

![fork collection step2](https://user-images.githubusercontent.com/1812516/196031088-2a0683a5-6a46-4704-9f8e-c88b548f4a2d.png)

点击 `Fork Collection` 完成导入。在你指定的 workspace 中可以看到《微信支付 APIv3》了。

![fork collection step3](https://user-images.githubusercontent.com/1812516/196030065-1103c893-4104-4266-aa70-4b589cbfc6e0.png)

你也可以 [本地导入脚本](#本地导入脚本)。

### 步骤2：配置 Environment

[环境（Environment）](https://learning.postman.com/docs/sending-requests/managing-environments/) 是一组变量 (Varibles) 的集合。
脚本从环境中读取变量，用来计算请求的签名。

你可以从《微信支付 APIv3》提供的 [商户参数模版](https://www.postman.com/wechatpay-dev/workspace/apiv3-public-workspace/environment/3391715-9f0f28eb-c323-4830-b9bc-3d1394562701) 中 fork 一个空环境到自己的工作台。

![fork environment](https://user-images.githubusercontent.com/1812516/196032966-abc65edd-3ff4-42ae-8b3b-b9d97587a301.png)

接下来，在你工作台的 Enviroments 中找到新建的环境，点击 `Add a new varialbe` 添加新的变量：

- `mchid`：必填，商户号。
- `merchant_serial_no`：必填，商户 API 证书序列号。
- `apiclient_key.pem`：必填，PEM 格式的商户 API 私钥。

> **Warning**
> 为了安全，请仔细阅读[安全注意事项](#安全注意事项)。

一组常见配置如下图所示。

![enviroment varibles](https://user-images.githubusercontent.com/1812516/200261861-8073d9b4-bf34-47e1-9a36-5c931cdb935e.png)

### 步骤3：发送请求

> **Note** 
> 我们建议，使用桌面版 Postman app 发送请求，速度更快，体验更好！

现在回到工作台，进入《微信支付 APIv3》集合，选择你要发送的请求。

然后，填入请求参数，按照注释修改 Body 中的参数。

最后，选择你之前配置的 Environment，再点击地址栏右侧的`Send`按钮，发送请求吧。

![send request](https://user-images.githubusercontent.com/1812516/200260900-8e706607-fd68-44dd-95d0-bb4125746e79.png)

## 实现原理

`Pre-Request Script` 是一段 Javascript 脚本。Postman 在请求发送之前，执行这段脚本。脚本做了以下操作：

1. 加载依赖库
1. 读取 Environment 中的商户参数变量
1. 根据请求的方法、URL、参数、Body 等信息，构造签名串，并计算请求签名
1. 设置请求头 `Authorization`

> **Note**
> 有关 Postman 脚本的更多信息，请参考 [Scripting in Postman](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/)。

### 参数变量

|  变量名   | 是否必填  |  描述  | 备注 |
| - | :----: | - | - |
| mchid  | 是 | 商户号  | |
| merchant_serial_no | 是 | 商户 API 证书的证书序列号 |  |
| apiclient_key.pem | 是 | PEM 格式的商户 API 私钥 |  |
| openid | 否 | 用户的 OpenID，测试请求中的 {{openid}} |  |
| appid | 否 | 公众账号或者小程序的 AppID |  |
| shangmi | 否 | 值为 `true` 时使用商密签名 | 默认值为空，即使用 RSA 签名 |
| pubkey.pem | 国密签名时必填 | PEM 格式的商户 API 公钥 | 如果私钥 PEM 中包含公钥，该变量可不填 |
| server_url | 否 | 服务器地址 | 默认为 https://api.mch.weixin.qq.com |

### 依赖库

脚本直接使用了：

- [forge.min.js](forge.min.js)，[forge](https://github.com/digitalbazaar/forge) 的 PKI、RSA 和 ASN.1。
- [sm2.js](sm2.js)，腾讯国密库 TencentSM-javascript 的 SM2 签名。

为了避免每次请求都下载依赖库，两个库以源代码的方式存储在 Collection Variables。这大大减少了使用网页版 Postman 发送请求时的耗时。

## 安全注意事项

**商户 API 私钥**是非常敏感的信息。使用此代码时，应记住以下几点：

- 将配置了私钥的工作台（workspace）的可见性（Visibility）设置为私有 `Personal` 或者 `Private`，**不要**设置为公开 `Public`。
- 私钥的**变量类型**设置为 `secret`。变量值会以掩码的形式显示在屏幕上。
- 私钥的**变量值**设置在 `Current Value`。`Current Value` 仅保存在本地 [Session](https://blog.postman.com/sessions-faq/)，不会被发送至 Postman 的服务器。
- 如果使用来自其他人的 Postman 脚本，请检查依赖库、变量和脚本，确保没有被修改，避免被植入不安全代码。

> **Note**
> 有关 Postman 的安全机制，请参考 [Postman Security](https://www.postman.com/trust/security/)。

## 如何发起国密请求

使用 [国密-商户参数模版](https://www.postman.com/wechatpay-dev/workspace/apiv3-public-workspace/environment/3391715-ba22edc3-d5f0-4c6e-9b44-b790b5a69218)，在环境变量中设置：

- `shangmi`：值为 `true`。
- `mchid`：必填，商户号。
- `merchant_serial_no`：必填，商户 API 证书序列号。
- `apiclient_key.pem`：必填，PEM 格式的商户 API 私钥。
- `pubkey.pem`：必填，PEM 格式的商户 API 国密公钥。

这样，脚本会使用国密 SM2 计算签名，发送国密请求了。

## 本地导入脚本

Fork Collection 导入需要注册 Postman 账户。如果你离线或者不希望注册，有以下两种方式本地导入。

- Postman 界面左上角的 `Import` 按钮
- 菜单 `File` > `Import` 发起导入

选择下载到本地的 [wechatpay-apiv3.postman_collection.json](wechatpay-apiv3.postman_collection.json)，点击确认后，导入便完成了。

你会发现在工作台的 Collections 里新增了名为 《微信支付 APIv3》 的一组请求。

## 同步上游的变更

我们会逐步添加新接口和更新已有接口，但是你 fork 到自己工作台的集合分支并不会自动同步上游的变更。建议关注 `watch` 我们的 Public Workspace，这样上游变更时你会收到来自 postman 的通知。

![notification](https://user-images.githubusercontent.com/1812516/200259622-eaac0ec7-e55c-48a2-a710-e720ce677aef.png)

这时，你可使用 `pull changes` 拉取上游的变更。

![pull changes](https://user-images.githubusercontent.com/1812516/200260015-462757c2-4f7c-44db-9663-b901f0b36228.png)

postman 的 `pull changes` 可能会需要等待一定时间完成。如果遇到问题，重新 fork 也是一个好办法。

## 常见问题

### 发送请求时遇到错误提示“Error: Too few bytes to parse DER.”或者“Too few bytes to read ASN.1 value.”

通常是环境 Environments 里配置的变量 `merchantPrivateKey` 填写有误导致的。脚本接收的私钥，以 `-----BEGIN PRIVATEKEY-----` 开始，以 `-----END PRIVATE KEY-----` 结束的一串字符串。

### 为什么我发送请求很慢？

如果你使用的网页版 Postman，请使用桌面版 [Postman app](https://www.postman.com/downloads/)。因为浏览器中跨域资源共享（CORS）的限制，网页版发送请求是由 Postman 后台中转的。

或者使用 [Postman desktop agent](https://www.postman.com/downloads/postman-agent/)，更多信息请参考 [Postman 相关博客](https://blog.postman.com/introducing-the-postman-agent-send-api-requests-from-your-browser-without-limits/)。

## 联系我们

如果你有任何疑问，欢迎访问我们的[开发者社区](https://developers.weixin.qq.com/community/pay)进行反馈。

我们也欢迎各种各样的 issue 和 Merge Request:-)
