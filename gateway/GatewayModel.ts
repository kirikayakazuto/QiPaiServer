/**
 * @Author: 邓朗 
 * @Date: 2019-06-26 23:40:15  
 * @Describe: 具体实现GatewayService里面的一些函数逻辑
 * 这个类主要作用就是担心GatewayService类太长, 不方便观看
 */
import * as log4js  from 'log4js';
import WebSession from '../netbus/WebSession';
import ProtoBufTools from '../netbus/ProtoBufTools';
import Netbus from '../netbus/Netbus';
const logger = log4js.getLogger('console');


export default class GatewayModel  {
    private static instance: GatewayModel = null;
    public static getInstance(): GatewayModel {
        if(!this.instance) {
            this.instance = new GatewayModel();
        }
        return this.instance;
    }

    /** 已经登录的玩家 */
    private loginSessionMap: {[uid: number]: WebSession} = {};
    /** 获取已经登录玩家session */
    public getLoginSessionByUid(uid: number) {
        if(!this.loginSessionMap[uid]) {
            logger.error(`没有获取到这个已经登录的用户session, uid: ${uid}`);
            return null;
        }
        return this.loginSessionMap[uid];
    }
    /** 添加一个已经登录的玩家 */
    public addLoginSessionInLoginMap(sessionKey: number, uid: number) {
        if(this.loginSessionMap[uid]){
            logger.warn(`当前玩家已经在登录集合中存在, 将对其进行下线处理, uid: ${uid}`);
            // 下线处理
            // todo...
            return ;
        }
        this.loginSessionMap[uid] = Netbus.getInstance().getClientBySessionKey(sessionKey);
        return ;
    }
    /** 删除一个已经登录的玩家 */
    public removeLoginSessionLoginMap(uid: number) {
        this.loginSessionMap[uid] = null;
        delete this.loginSessionMap[uid];
    }

    /** 登录之前的命令 */
    private beforLoginMessageList:  Array<number> = [];
    /** 登录命令 */
    private loginMessageList:       Array<number> = [];
    /** 获得命令的类型 */
    public getCommandTypeOfMessage(stype: number, ctype: number): number {
        if(this.checkIsBeforLoginMessage(stype, ctype)) {
            return CommandType.BeforLogin;
        }
        if(this.checkIsLoginMessage(stype, ctype)) {
            return CommandType.Login;
        }
        return CommandType.Normal;
    }
    /** 检测是否是登录前的命令 */
    private checkIsBeforLoginMessage(stype: number, ctype: number) {
        let key = ProtoBufTools.getKeyByStypeAndCtype(stype, ctype);
        let index = ProtoBufTools.findIndexInArray(this.beforLoginMessageList, key);
        if(index == -1) {
            return false;
        }
        return true;
    }
    /** 检测是否是登录命令 */
    private checkIsLoginMessage(stype: number, ctype: number) {
        let key = ProtoBufTools.getKeyByStypeAndCtype(stype, ctype);
        let index = ProtoBufTools.findIndexInArray(this.loginMessageList, key);
        if(index == -1) {
            return false;
        }
        return true;
    }
}


export enum CommandType {
    BeforLogin = 1,
    Login = 2,
    Normal = 3,
}