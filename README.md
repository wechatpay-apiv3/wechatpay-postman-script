# 微信支付API v3 Postman脚本使用指南

## 简介
[Postman](https://www.getpostman.com/products)是一款业界知名的API开发工具。为了方便微信支付的商户开发者快速上手，我们利用Postman强大的脚本扩展能力，编写了一套微信支付API v3的请求前置脚本。通过这套脚本，商户开发者不用自行计算API v3的签名，就可以在Postman上轻松的构造并发送API请求。

## 导入

脚本和相关配置，统一保存在[Collection V2](https://go.pstmn.io/collection-v2)的`JSON`文件中。开发者可以点击Postman界面左上角的`Import`按钮或者通过`File`中的`Import`发起导入。选择本地的`wechatpay-apiv3.postman_collection.json`，点击确认后，导入便完成了。

你会发现在左侧Collection下新增了名为`wechatpay-apiv3`的一组请求。

## 配置脚本

选中`wechatpay-apiv3`，右键`Edit`进入Collection的配置页面。在弹出的`Edit Collection`的浮层上部的多个分栏中，找到`Pre-request Script`一栏。点击进入。你会看到如下的代码

```javascript
const private_key = `-----BEGIN PRIVATE KEY-----
-----END PRIVATE KEY-----`;
      
const mchid = "190000xxxx";
const serialNo = "yourserialno";

// ....以下省略
```

这就是你需要配置三个参数。

+ private_key，商户私钥，位于文件`apiclient_key.pem`中。请见，[商户API证书](https://wechatpay-api.gitbook.io/wechatpay-api-v3/ren-zheng/zheng-shu)和[什么是私钥？什么是证书？](https://wechatpay-api.gitbook.io/wechatpay-api-v3/chang-jian-wen-ti/zheng-shu-xiang-guan#shen-me-shi-si-yao-shen-me-shi-zheng-shu)。
+ mchid，商户号。
+ serialNo，商户证书的证书序列号。请见[什么是证书序列号](https://wechatpay-api.gitbook.io/wechatpay-api-v3/chang-jian-wen-ti/zheng-shu-xiang-guan#shen-me-shi-si-yao-shen-me-shi-zheng-shu)。

## 配置请求

现在回到请求的配置界面吧。接下来，你可以用自己习惯的方式去设置请求的信息了，如方法、URL、请求参数、Body。最后，配置两项：

+ `Authorization`的`Type`选择`No Auth`。
+ 在请求的头部`Headers`中，新增一条，`KEY`设为`Authorization`，`VALUE`设为`{{auth}}`。

我们准备了`平台证书下载`和`发放指定批次的代金券`两个请求样例供开发者参考，分别对应`GET`和`POST`两种典型的操作。开发者也可以在两个请求样例的基础上进行修改，或者复制出新的请求。

## 发起请求

点击地址栏右侧的`Send`按钮，发送你的请求吧。

## 实现原理

我们通过定制Postman的`Pre-request Script`，实现了请求的签名。

`Pre-request Script`脚本会在请求发送之前被执行。在脚本中，我们根据请求的方法、URL、请求参数、Body等信息，计算了微信支付API v3的`Authorization`信息，并设置到了环境变量`auth`当中。而在请求发送时，`Headers`中配置的`{{auth}}`将被替换成真实的签名值，实现了请求的签名。

关于Postman脚本的信息，可以参考[Pre-request Script](https://learning.getpostman.com/docs/postman/scripts/pre_request_scripts/)。

## 联系我们

如果你有任何疑问，欢迎访问我们的[开发者社区](https://developers.weixin.qq.com/community/pay)进行反馈。

我们也欢迎各种各样的issue和Merge Request:-)

