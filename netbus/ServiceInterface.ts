import WebSession from "./WebSession";

/**
 * @Author: 邓朗 
 * @Date: 2019-06-24 10:27:51  
 * @Describe: 服务统一接口, 每一个自定义服务都必须实现
 */
export default interface ServiceInterface {
    /** 服务号 */
    stype: number;
    serviceName: string;
    isForwardService: boolean;

    /** 初始化 */
    init(): any;
    /** 客户端消息传递给gateway */
    onRecvClientMessageToGateway?(client: WebSession, stype: number, ctype: number, rawMessaeg: Buffer): void;
    /** netbus传递消息给service */
    onRecvClientMessageToService?(client: WebSession, ctype: number, utag: number, body: Buffer): void;

    /** 收到客户端断开连接的通知 */
    onClientDisconnect(stype: number, uid: number): void;

    /** 收到gateway转发来的消息 */
    onRecvServerMessageFormGateway?(client: WebSession, stype: number, ctype: number, utag: number, rawMessaeg: Buffer): void;
    /**  */
    onRecvServerMessageFormService?(client: WebSession, ctype: number, utag: number, body: Buffer): void;
}