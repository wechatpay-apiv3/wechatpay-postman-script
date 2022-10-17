# 微信支付 APIv3 Postman 脚本

微信支付 APIv3 的 [Postman](https://www.postman.com) 请求前置脚本（[Pre-Request Script](https://learning.postman.com/docs/writing-scripts/pre-request-scripts/)）。

为了帮助商户开发者快速上手，我们将脚本部署到 Postman 云工作台 [APIv3 Public Workspace](https://www.postman.com/wechatpay-dev/workspace/apiv3-public-workspace/overview)。你不用手动导入脚本，只需要将集合[《微信支付 APIv3》](https://www.postman.com/wechatpay-dev/workspace/apiv3-public-workspace/collection/3391715-85f478d8-2596-420a-9f21-53376fc6ad0a) fork 到自己的工作台，就可以在 Postman 上轻松地构造并发送微信支付 APIv3 请求了。

## 前置条件

- [Postman](https://www.postman.com/downloads/)，一款业界知名的 API 构建和使用平台。建议注册一个账户，便于使用它各种功能。
- [成为微信支付商户](https://pay.weixin.qq.com/index.php/apply/applyment_home/guide_normal)。
- [商户 API 私钥](https://wechatpay-api.gitbook.io/wechatpay-api-v3/ren-zheng/zheng-shu#shang-hu-api-si-yao)：商户申请商户API证书时，会生成商户私钥，并保存在本地证书文件夹的文件 apiclient_key.pem 中。

## 快速开始

### 步骤1：Fork 方式导入脚本

使用向导 [![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/3391715-85f478d8-2596-420a-9f21-53376fc6ad0a?action=collection%2Ffork&collection-url=entityId%3D3391715-85f478d8-2596-420a-9f21-53376fc6ad0a%26entityType%3Dcollection%26workspaceId%3D5f619604-11ee-42a4-b148-22abec1f0611) 快速导入。点击左侧▶️按钮进入向导，如下图所示。

![fork collection step1](https://user-images.githubusercontent.com/1812516/196029034-fb5e9453-fbef-4267-94cc-8566dc008314.png)

点击 `Fork Collection` 进入下一步，填入标签 `Fork Label` 并选择目的工作台 `Workspace`。一般情况下，导入个人工作台 My Workspace 即可。

![fork collection step2](https://user-images.githubusercontent.com/1812516/196031088-2a0683a5-6a46-4704-9f8e-c88b548f4a2d.png)

点击 `Fork Collection` 完成导入。在你指定的 workspace 中可以看到《微信支付 APIv3》了。

![fork collection step3](https://user-images.githubusercontent.com/1812516/196030065-1103c893-4104-4266-aa70-4b589cbfc6e0.png)

你也可以 [手工导入脚本](#手工导入脚本)。

### 步骤2：配置 Environment

[环境（Environment）](https://learning.postman.com/docs/sending-requests/managing-environments/) 是一组变量 (Varibles) 的集合。脚本会读取环境中以下变量：

- `merchantId`：必填，商户号。
- `merchantSerialNo`：必填，商户 API 证书序列号。
- `merchantPrivateKey`：必填，PEM 格式的商户 API 私钥。

你可以从《微信支付 APIv3》提供的 [商户参数模版](https://www.postman.com/wechatpay-dev/workspace/apiv3-public-workspace/environment/3391715-9f0f28eb-c323-4830-b9bc-3d1394562701) 中 fork 环境到自己的工作台。

![fork environment](https://user-images.githubusercontent.com/1812516/196032966-abc65edd-3ff4-42ae-8b3b-b9d97587a301.png)

接下来，在你工作台的 Enviroments 中找到新建的环境，填入`商户号`、`商户 API 证书序列号`和`商户 API 私钥`。如下图所示。

![enviroment varibles](https://user-images.githubusercontent.com/1812516/196086544-249bcd6a-9973-4854-9310-f8dee61cf196.png)

你可以建立多组环境，对应不同的商户配置。

### 步骤3：发送请求

现在回到工作台的请求构造界面吧，填入请求方法、URL、请求参数、Body 等参数。

工作台预置了`获取微信支付平台证书列表`和`JSAPI下单`两个请求样例供开发者参考，分别对应 `GET` 和 `POST` 两种典型的操作。开发者可以两个请求样例出发，构造自己的请求。

最后，选择你之前配置的 Environment，再点击地址栏右侧的`Send`按钮，发送请求吧。

![send request](https://user-images.githubusercontent.com/1812516/196033692-a277267d-af1a-46df-a0e5-2244f97580a7.png)

## 实现原理

`Pre-Request Script` 是一段 Javascript 脚本。Postman 在请求发送之前，执行这段脚本。脚本做了以下操作：

1. 加载依赖库
1. 读取 Environment 中的商户参数变量
1. 根据请求的方法、URL、参数、Body 等信息，构造签名串，并计算请求签名
1. 设置请求头 `Authorization`

关于 Postman 脚本的更多信息，请参考[Scripting in Postman](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/)。

### 依赖库

脚本直接使用了：

- [forge.min.js](forge.min.js)，[forge](https://github.com/digitalbazaar/forge) 的 PKI、RSA 和 ASN.1。
- [sm2.js](sm2.js)，腾讯国密库 TencentSM-javascript 的 SM2 签名。

为了避免每次请求都下载依赖库，两个库以源代码的方式存储在 Collection Variables。这大大减少了使用网页版 Postman 发送请求时的耗时。

## 安全注意事项

**商户 API 私钥**是非常敏感的信息。使用此代码时，应记住以下几点：

- 将配置了私钥的工作台（workspace）的可见性（Visibility）设置为私有 `Personal` 或者 `Private`，**不要**设置为公开 `Public`。
- 私钥的**变量类型**设置为 `secret`。变量值会以掩码的形式显示在屏幕上。
- 私钥的**变量值**设置在 `Current Value`。`Current Value` 不会被发送至 Postman 的服务器。这也意味着，为了安全，私钥在每次使用时设置。
- 如果使用来自其他人的 Postman 脚本，请检查依赖库、变量和脚本，确保没有被修改，避免被植入不安全代码。

## 如何发起国密请求

使用 [国密-商户参数模版](https://www.postman.com/wechatpay-dev/workspace/apiv3-public-workspace/environment/3391715-ba22edc3-d5f0-4c6e-9b44-b790b5a69218)，在环境变量中设置：

- `shangmi`：值为 `true` 时使用商密，默认值为空（即不使用国密）。
- `merchantPublicKey`：商户 API 国密公钥。如果你的国密私钥中包括了公钥，也可以不填。

这样，脚本会使用国密 SM2 计算签名，发送国密请求了。

## 本地导入脚本

Fork Collection 导入需要注册 Postman 账户。如果你离线或者不希望注册，有以下两种方式本地导入。

- Postman 界面左上角的 `Import` 按钮
- 菜单 `File` > `Import` 发起导入

选择下载到本地的 [wechatpay-apiv3.postman_collection.json](wechatpay-apiv3.postman_collection.json)，点击确认后，导入便完成了。

你会发现在工作台的 Collections 里新增了名为 《微信支付 APIv3》 的一组请求。

## 常见问题

### 发送请求时遇到错误提示“Error: Too few bytes to parse DER.”或者“Too few bytes to read ASN.1 value.”

通常是环境 Environments 里配置的变量 `merchantPrivateKey` 填写有误导致的。脚本接收的私钥，以 `-----BEGIN PRIVATEKEY-----` 开始，以 `-----END PRIVATE KEY-----` 结束的一串字符串。

## 联系我们

如果你有任何疑问，欢迎访问我们的[开发者社区](https://developers.weixin.qq.com/community/pay)进行反馈。

我们也欢迎各种各样的 issue 和 Merge Request:-)
