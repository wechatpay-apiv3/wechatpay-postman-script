/* global pm, require, console, forge, SM2Lib */
const forge_code = pm.collectionVariables.get("forge_code");
eval(forge_code);

const { asn1 } = forge;

/**
 * 从PEM证书中获取国密PrivateKey对象.
 *
 * @param pem 国密商户API私钥.
 *
 * @return 国密PrivateKey对象.
 */
function privateKeyFromPem(pem) {
  const msg = forge.pem.decode(pem)[0];

  if (msg.type !== "PRIVATE KEY") {
    throw new Error("格式非法的商户API私钥.错误的PEM类型");
  }

  if (msg?.procType === "ENCRYPTED") {
    throw new Error("格式非法的商户API私钥.不支持加密的PEM");
  }

  const privateKeyValidator = {
    // PrivateKeyInfo
    name: "PrivateKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [
      {
        // Version (INTEGER)
        name: "PrivateKeyInfo.version",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "privateKeyVersion",
      },
      {
        // privateKeyAlgorithm
        name: "PrivateKeyInfo.privateKeyAlgorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [
          {
            name: "AlgorithmIdentifier.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "algorithm",
          },
          {
            name: "AlgorithmIdentifier.namedCurveOID",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "namedCurveOid",
          },
        ],
      },
      {
        // privateKeyInfo
        name: "PrivateKeyInfo.PrivateKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: "ecPrivateKey",
      },
    ],
  };
  const ecPrivateKeyValidator = {
    name: "ecPrivateKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [
      {
        // Version
        name: "Version",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "version",
      },
      {
        // PrivateKey
        name: "PrivateKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: "privateKey",
      },
      {
        // NamedCurveOID, optional, tag:0
        name: "NamedCurveOID",
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        optional: true,
        constructed: true,
        value: [
          {
            name: "ObjectIdentifier",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "namedCurveOid",
          },
        ],
      },
      {
        // PublicKey, optional, tag:1
        name: "PublicKey",
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 1,
        optional: true,
        constructed: true,
        value: [
          {
            name: "PublicKey",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: false,
            captureBitStringValue: "publicKey",
          },
        ],
      },
    ],
  };

  let obj = asn1.fromDer(msg.body);
  // get PrivateKeyInfo
  let privateKeyInfo = {};
  let errors = [];
  if (asn1.validate(obj, privateKeyValidator, privateKeyInfo, errors)) {
    obj = asn1.fromDer(forge.util.createBuffer(privateKeyInfo.ecPrivateKey));
  } else {
    let error = new Error("读取商户API私钥失败. ASN.1结构中没有包含私钥");
    error.errors = errors;
    throw error;
  }
  privateKeyInfo.privateKeyVersion = forge.util.bytesToHex(
    privateKeyInfo.privateKeyVersion
  );
  privateKeyInfo.algorithm = asn1.derToOid(privateKeyInfo.algorithm);
  privateKeyInfo.namedCurveOid = asn1.derToOid(privateKeyInfo.namedCurveOid);

  // get ECDSA PrivateKey
  let ecPrivateKeyInfo = {};
  errors = [];
  if (!asn1.validate(obj, ecPrivateKeyValidator, ecPrivateKeyInfo, errors)) {
    let error = new Error("读取商户API私钥失败. ASN.1结构中没有包含ECDSA私钥");
    error.errors = errors;
    throw error;
  }

  ecPrivateKeyInfo.version = forge.util.bytesToHex(ecPrivateKeyInfo.version);
  ecPrivateKeyInfo.privateKey = forge.util.bytesToHex(
    ecPrivateKeyInfo.privateKey
  );
  if ("publicKey" in ecPrivateKeyInfo) {
    ecPrivateKeyInfo.publicKey = forge.util.bytesToHex(
      ecPrivateKeyInfo.publicKey
    );
  }
  if ("namedCurveOid" in ecPrivateKeyInfo) {
    ecPrivateKeyInfo.namedCurveOid = asn1.derToOid(
      ecPrivateKeyInfo.namedCurveOid
    );
  }
  privateKeyInfo.ecPrivateKey = ecPrivateKeyInfo;

  return privateKeyInfo;
}

/**
 * 从PEM证书中获取国密PublicKey对象.
 *
 * @param pem 国密商户API公钥.
 *
 * @return 国密PublicKey对象.
 */
function publicKeyFromPem(pem) {
  let msg = forge.pem.decode(pem)[0];

  if (msg.type !== "PUBLIC KEY") {
    throw new Error("格式非法的商户API公钥.错误的PEM类型");
  }

  let obj = asn1.fromDer(msg.body);

  const publicKeyValidator = {
    // pkixPublicKey
    name: "PublicKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [
      {
        name: "AlgorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [
          {
            name: "AlgorithmIdentifier.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "algorithm",
          },
          {
            name: "NamedCurveOID",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "namedCurveOid",
          },
        ],
      },
      {
        // BitString
        name: "PublicKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.BITSTRING,
        constructed: false,
        captureBitStringValue: "publicKey",
      },
    ],
  };

  // get PublicKeyInfo
  let publicKeyInfo = {};
  let errors = [];
  if (!asn1.validate(obj, publicKeyValidator, publicKeyInfo, errors)) {
    let error = new Error("读取商户API公钥失败. ASN.1结构中没有包含公钥");
    error.errors = errors;
    throw error;
  }
  publicKeyInfo.algorithm = asn1.derToOid(publicKeyInfo.algorithm);
  publicKeyInfo.namedCurveOid = asn1.derToOid(publicKeyInfo.namedCurveOid);
  publicKeyInfo.publicKey = forge.util.bytesToHex(publicKeyInfo.publicKey);

  return publicKeyInfo;
}

const nonceStr = pm.variables.replaceIn("{{$guid}}"),
  timeStamp = pm.variables.replaceIn("{{$timestamp}}");

// 变量替换，把请求中所有的Variables赋值
const sdk = require("postman-collection"),
  newRequest = new sdk.Request(pm.request.toJSON()),
  resolvedRequest = newRequest.toObjectResolved(
    null,
    [pm.variables.toObject()],
    { ignoreOwnVariables: true }
  ),
  url = new sdk.Url(resolvedRequest.url),
  canonicalUrl = url.getPathWithQuery();

const method = pm.request.method;

let body = "";
if (method === "POST" || method === "PUT" || method === "PATCH") {
  // 使用变量替换后的body
  body = resolvedRequest.body.raw;
  if (canonicalUrl.endsWith("upload")) {
    const result = JSON.parse(JSON.stringify(resolvedRequest.body.formdata));
    for (const [key, value] of result) {
      if (key === "meta") {
        body = value;
      }
    }
  }
}

// 计算签名源串
const message =
  method +
  "\n" +
  canonicalUrl +
  "\n" +
  timeStamp +
  "\n" +
  nonceStr +
  "\n" +
  body +
  "\n";

let auth;
const enableShangMi = pm.environment.get("shangmi");
if (enableShangMi == "true") {
  console.log("using ShangMi for signature");

  const sm2js_code = pm.collectionVariables.get("sm2js_code");
  eval(sm2js_code);

  const mchid = pm.environment.get("merchantId");
  const serialNumber = pm.environment.get("merchantSerialNo");
  // 二进制的私钥和公钥
  const privateKeyPem = pm.environment.get("merchantPrivateKey");
  const publicKeyPem = pm.environment.get("merchantPublicKey");

  const privateKeyInfo = privateKeyFromPem(privateKeyPem);
  const publicKey =
    "publicKey" in privateKeyInfo.ecPrivateKey
      ? privateKeyInfo.ecPrivateKey.publicKey
      : publicKeyFromPem(publicKeyPem).publicKey;

  const signHex = new SM2Lib.SM2().sign(
    publicKey,
    privateKeyInfo.ecPrivateKey.privateKey,
    SM2Lib.utils.stringToByteArrayInUtf8(message),
    SM2Lib.utils.stringToByteArrayInUtf8("1234567812345678")
  );

  const signature = forge.util.encode64(forge.util.hexToBytes(signHex));
  auth = `WECHATPAY2-SM2-WITH-SM3 mchid="${mchid}",serial_no="${serialNumber}",nonce_str="${nonceStr}",timestamp="${timeStamp}",signature="${signature}"`;
} else {
  console.log("using RSA for signature");

  const mchid = pm.environment.get("merchantId");
  const serialNo = pm.environment.get("merchantSerialNo");
  // pem私钥字符串
  const privateKeyStr = pm.environment.get("merchantPrivateKey");
  // 从pem中加载私钥
  const privateKey = forge.pki.privateKeyFromPem(privateKeyStr);

  const sha256 = forge.md.sha256.create();
  sha256.update(forge.util.encodeUtf8(message));

  const signature = forge.util.encode64(privateKey.sign(sha256));
  auth = `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",serial_no="${serialNo}",nonce_str="${nonceStr}",timestamp="${timeStamp}",signature="${signature}"`;
}

pm.request.headers.add({
  key: "Authorization",
  value: auth,
});
