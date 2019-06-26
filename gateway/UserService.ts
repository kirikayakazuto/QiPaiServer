/**
 * @Author: 邓朗 
 * @Date: 2019-06-26 23:11:16  
 * @Describe: 用户管理服务
 */
import ServiceInterface from "../netbus/ServiceInterface";
import WebSession from "../netbus/WebSession";
import UserServiceCtype from "./UserServiceCtype";
import GatewayModel from "./GatewayModel";
export class UserService implements ServiceInterface {
    /** 服务号 */
    stype = 101;
    serviceName = "UserService";
    isForwardService: boolean;

    /** 初始化 */
    init(): any {

    }
    /** netbus传递消息给service */
    onRecvClientMessageToService?(client: WebSession, ctype: number, utag: number, body: Buffer): void {
        switch(ctype) {
            case UserServiceCtype.AddLoginUser:
            break;
        }
    }
    /** 收到客户端断开连接的通知 */
    onClientDisconnect(stype: number, uid: number): void {

    }
    /** 收到服务器转发来的消息 */
    onRecvServerMessageFormService(client: WebSession, ctype: number, utag: number, body: Buffer): void {
        switch(ctype) {
            case UserServiceCtype.AddLoginUser:
                addLoginUser(client, ctype, utag, body);
            break;
            case UserServiceCtype.RemoveLoginUser:
                removeLoginUser();
            break;
        }
    }
}

/** 添加一个已经登录的用户 */
function addLoginUser(client: WebSession, ctype: number, utag: number, body: Buffer) {
    // GatewayModel.getInstance().addLoginSessionInLoginMap(utag, uid);
}
/** 删除一个已经登录的用户 */
function removeLoginUser() {

}