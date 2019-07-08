/**
 * @Author: 邓朗 
 * @Date: 2019-07-01 23:19:19  
 * @Describe: 加密解密工具类
 */
import * as crypto from "crypto"
export default class CryptoHelpter {
    private static instance: CryptoHelpter = null;
    public static getInstance() {
        if(this.instance === null) {
            this.instance = new CryptoHelpter();
        }
        return this.instance;
    }
    
    /** 秘钥 */
    private password = "123";
    /** 加密对象 */
    private cipher = crypto.createCipher('aes-192-gcm', this.password);

    // md5加密
    public getMD5(data: any) {
        return crypto.createHash('md5').update(data).digest('hex');
    }

    // 二进制ArrayBuffer加密
    public encryptData(uint8Array: Uint8Array) {
        
        this.cipher.update(uint8Array);
    }

    // 二进制ArrayBuffer解密
    public decryptData(arrayBuffer: ArrayBuffer) {

    }
    // todo...
}

let md5_123 = CryptoHelpter.getInstance().getMD5("123");
console.log(md5_123);