import ServiceInterface from "../../netbus/ServiceInterface";
import UserCenterCtype from "./UserCenterCtype";
import WebSession from "../../netbus/WebSession";
import Message from "../../netbus/Message";
import * as log4js  from 'log4js';
/**
 * @Author: 邓朗 
 * @Date: 2019-06-25 23:28:22  
 * @Describe: 用户中心服务
 * 用于处理用户信息的服务, 例如注册, 登录, 修改资料, 充值
 */
const logger = log4js.getLogger('console');
export default class UserCenterService implements ServiceInterface {
    /** 服务号 */
    stype       = 1;
    serviceName = "UserCenterService";
    isForwardService = false;

    /** 初始化 */
    init(): any {

    }
    /** 收到客户端的消息 */
    public onRecvClientMessageToService?(client: WebSession, ctype: number, utag: number, body: Buffer): void {
        logger.info(this.stype, ctype)
        switch(ctype) {
            case UserCenterCtype.GuestLogin:
            break;
            case UserCenterCtype.AccountLogin:
            break;
        }
    }
    /** 收到客户端断开连接的通知 */
    public onClientDisconnect(stype: number, uid: number): void {

    }
    /** 收到服务器转发来的消息 */
    public onRecvServerMessageFormService(client: WebSession, ctype: number, utag: number, body: Buffer): void {

    }
}
/** 游客登录 */
function guestLogin(client: WebSession, utag: number, body: Buffer) {
    
}
