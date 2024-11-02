import {VercelRequest, VercelResponse} from '@vercel/node';
import CryptoJS from 'crypto-js';


function post(request: VercelRequest, response: VercelResponse) {
  const timestamp = Math.floor(Date.now() / 1e3);
  const {url, method, requestBody, openId, appId, nonceStr, orgCode} = request.body;
  if (!url || !method || !openId || !appId || !nonceStr || !orgCode) {
    return response.status(400).json({message: 'Bad Request, mandatory fields must be provided. e.g. url, method, requestBody, openId, appId, nonceStr, orgCode'});
  }
  const beforeEncryption = `${method}
${url}
${timestamp}
${nonceStr}
${requestBody}
${appId}
`;
  const signature = CryptoJS.MD5(beforeEncryption).toString();
  return response.status(200).json({
    plainTxt: beforeEncryption,
    encryption: signature,
    authorization: `MD5 appid="${appId}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}"`,
  })
}

export default function (request: VercelRequest, response: VercelResponse) {
  switch (request.method) {
    // case 'GET':
    //   return get(request, response);
    case 'POST':
      return post(request, response);
    default:
      return response.status(405).json({message: 'Method Not Allowed'});
  }
}
