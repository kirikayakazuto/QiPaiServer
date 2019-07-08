export default class ProtoBufTools {
    /** stype1个字节 ctype2个字节 4个字节utag */
    public static headSize = 7;

    /** 获得stypeh和ctype的唯一标识 */
    public static getKeyByStypeAndCtype(stype: number, ctype: number) {
        return (stype * 256 + ctype);
    }

    /** 寻找对应元素的下标 */
    public static findIndexInArray<T>(array: Array<T>, e: T) {
        for(let i=0; i<array.length; i++) {
            if(array[i] === e) {
                return i;
            }
        }
        return -1;
    }   

    public static allocBuffer(totalLen: number) {
        return Buffer.allocUnsafe(totalLen);
    }

    /** 编码头部信息 */
    public static encodeHeadMessage(buf: Buffer, stype: number, ctype: number, uid: number) {
        buf.writeInt8(stype, 0);
        buf.writeInt16LE(ctype, 1);
        buf.writeInt32LE(uid, 3);
    }

     /** 向消息中打入utag */
     public static writeUtagToMessage(buf: Buffer, utag: number) {
        return buf.writeInt32LE(utag, 3);
    }
    /** 清理消息中的utag */
    public static clearUtagToMessage(buf: Buffer) {
        return buf.writeInt32LE(0, 3);
    }

    public static writeUint8ArraytoBuffer(buffer: Buffer, uint8: Uint8Array) {
        for(let i=0; i<uint8.length; i++) {
            buffer.writeUInt8(uint8[i], ProtoBufTools.headSize + i);
        }
    }
}