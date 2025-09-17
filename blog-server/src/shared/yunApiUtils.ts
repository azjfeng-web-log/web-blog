/* eslint-disable */
const crypto = require('crypto');
const moment = require('moment');
const request = require('request');

export class YunApiUtils {
  requestHandler;

  constructor() {
    this.requestHandler = request.defaults({});
  }

  setProxy(proxy) {
    // this.requestHandler = request.defaults({ proxy });
  }

  getAuthorization(
    { secretKey, secretId, host, service, action },
    param,
    unixTimeStamp,
  ) {
    // ************* 步骤 1：拼接规范请求串 *************
    const http_request_method = 'POST';
    const canonical_uri = '/';
    const canonical_querystring = '';
    const canonical_headers = `content-type:application/json\nhost:${host}\n`;
    const SignedHeaders = 'content-type;host';
    const hash = crypto.createHash('sha256');
    const HashedRequestPayload = hash
      .update(JSON.stringify(param))
      .digest('hex');

    //console.log(HashedRequestPayload);

    const CanonicalRequest =
      http_request_method +
      '\n' +
      canonical_uri +
      '\n' +
      canonical_querystring +
      '\n' +
      canonical_headers +
      '\n' +
      SignedHeaders +
      '\n' +
      HashedRequestPayload;

    //console.log("===============CanonicalRequest=====================");
    //console.log(CanonicalRequest);
    //# ************* 步骤 2：拼接待签名字符串 *************

    const Algorithm = 'TC3-HMAC-SHA256';
    const RequestTimestamp = parseInt(String(unixTimeStamp / 1000));
    const CredentialScope =
      moment.utc(unixTimeStamp).format('YYYY-MM-DD') +
      '/' +
      service +
      '/tc3_request';
    const hash2 = crypto.createHash('sha256');
    const HashedCanonicalRequest = hash2.update(CanonicalRequest).digest('hex');

    const StringToSign =
      Algorithm +
      '\n' +
      RequestTimestamp +
      '\n' +
      CredentialScope +
      '\n' +
      HashedCanonicalRequest;
    //console.log("===============StringToSign=====================");
    //console.log(StringToSign);

    //# ************* 步骤 3：计算签名 *************

    function sign(key, ValidateData) {
      const hmac = crypto.createHmac('sha256', key);
      return hmac.update(ValidateData).digest();
    }

    const SecretDate = sign(
      'TC3' + secretKey,
      moment.utc(unixTimeStamp).format('YYYY-MM-DD'),
    );
    const SecretService = sign(SecretDate, service);
    const SecretSigning = sign(SecretService, 'tc3_request');
    const hmac = crypto.createHmac('sha256', SecretSigning);
    const Signature = hmac.update(StringToSign).digest('hex');

    //console.log("===============signature=====================");
    //console.log(Signature);

    //# ************* 步骤 4：拼接 Authorization *************

    const Authorization =
      Algorithm +
      ' ' +
      'Credential=' +
      secretId +
      '/' +
      CredentialScope +
      ', ' +
      'SignedHeaders=' +
      SignedHeaders +
      ', ' +
      'Signature=' +
      Signature;

    //console.log("===============Authorization=====================");
    // console.log(Authorization);
    return Authorization;
  }

  async apiRequest(serverConfig, postData, timeOut = 35000) {
    return new Promise((resolve, reject) => {
      const unixTimeStamp = Date.now();
      const Authorization = this.getAuthorization(
        serverConfig,
        postData,
        unixTimeStamp,
      );
      const postConfig = {
        url: serverConfig.url,
        method: 'POST',
        headers: {
          Authorization: Authorization,
          Host: serverConfig.host,
          'Content-Type': 'application/json',
          'X-TC-Action': serverConfig.action,
          'X-TC-Timestamp': parseInt(String(unixTimeStamp / 1000)).toString(),
          'X-TC-Version': serverConfig.version,
          'X-TC-Region': serverConfig.region,
        },
        json: true,
        body: postData,
        timeout: timeOut,
      };

      this.requestHandler(postConfig, function (error, response, body) {
        if (error) {
          reject(error);
        }
        resolve(body);
      });
    });
  }
}
