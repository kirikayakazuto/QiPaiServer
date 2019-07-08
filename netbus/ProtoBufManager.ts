import ProtoBufTools from "./ProtoBufTools";
import * as log4js  from 'log4js';
/**
 * @Author: 邓朗 
 * @Date: 2019-06-24 11:56:36  
 * @Describe: 管理ProtoBuf协议
 */
const logger = log4js.getLogger('console');
export default class ProtoBufManager {
    private static instance: ProtoBufManager = null;
    public static getInstance() {
        if(this.instance === null) {
            this.instance = new ProtoBufManager();
        }
        return this.instance;
    }

    /** 加密解密 */
    public encryptMessage(message: Buffer) {
        return message;
    }
    public decryptMessage(message: Buffer) {
        return message;
    }

    /** 编码, 解码 */
    public encodeMessage(stype: number, ctype: number, uid: number, body: Uint8Array) {
        let tatleLen = ProtoBufTools.headSize + body.length;
        let buf = ProtoBufTools.allocBuffer(tatleLen);
        ProtoBufTools.encodeHeadMessage(buf, stype, ctype, uid);
        ProtoBufTools.writeUint8ArraytoBuffer(buf, body);
        return buf;
    }
    public decodeMessage() {
        
    }

    /** 解码头部信息 */
    public decodeHeadMessage(message: Buffer) {
        let cmd: Array<number> = [];
        if(message.length < ProtoBufTools.headSize) {
            logger.error(`解码头部信息有误, message长度小于最低限制`);
            return null;
        }

        cmd[0] = message.readInt8(0);       // 1个字节
        cmd[1] = message.readInt16LE(1);    // 2个字节
        cmd[2] = message.readInt32LE(3);    // 4个字节
        return cmd;
    }
    public decodeBodyMessage(message: Buffer) {
        return message.slice(ProtoBufTools.headSize);
    }

   

    
}

