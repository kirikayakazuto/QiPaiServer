import ProtoBufManager from "./ProtoBufManager";

export default class WebSession extends WebSocket {
    /** 玩家的唯一标识 */
    public uid?: number;
    /** 是否加密了 */
    public isEncrypt?: boolean;
    /** sessionKey */
    public sessionKey?: number;

    /** 发送一条没有编码的消息 */
    public sendMessage?(stype: number, ctype: number, body: Buffer, utag: number) {
        let cmd = ProtoBufManager.getInstance().encodeMessage(stype, ctype, utag, body);
        if(this.isEncrypt) {
            cmd = ProtoBufManager.getInstance().encryptMessage(cmd);
        }
        this.send(cmd);
    }
}