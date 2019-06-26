/**
 * @Author: 邓朗 
 * @Date: 2019-06-24 10:39:54  
 * @Describe: 管理所有的自定义服务
 */
import * as log4js  from 'log4js';
import ServiceInterface from "./ServiceInterface";
import WebSession from './WebSession';
import ProtoBufManager from './ProtoBufManager';

const logger = log4js.getLogger('console');

export default class ServiceManager {
    /** 单例 */
    private static instance: ServiceManager = null;
    public static getInstance() {
        if(this.instance === null) {
            this.instance = new ServiceManager();
        }
        return this.instance;
    }

    /** 网关, 类似前台 GatewayService */
    private serviceModulesMap: {[key: number]: ServiceInterface} = {};

    /** 注册网关 */
    public registerServices(stype: number, service: ServiceInterface) {
        if(this.serviceModulesMap[stype]) {
            logger.warn(`自定义服务已经注册过了!`);
        }
        this.serviceModulesMap[stype] = service;
        service.init();
    }
    /** 客户端掉线了, 通知 */
    public onClientDisconnect(client: WebSession) {
        let uid = client.uid;
        if(uid === undefined || uid === 0) {
            logger.error(`掉线玩家的uid不存在 ${uid}, 这表示玩家还处于登录前状态, 不需要通知其他自定义服务器`);
            return ;
        }
        /** 有玩家掉线了 */
        for(let key in this.serviceModulesMap) {
            this.serviceModulesMap[key].onClientDisconnect(parseInt(key), uid);
        }
        client.uid = 0;
    }
    /** 收到了客户端的信息, 上行通道 */
    public onRecvClientMessage(client: WebSession, message: Buffer) {
        /** 加密消息需要解密 */
        if(client.isEncrypt) {
            ProtoBufManager.getInstance().decryptMessage(message);
        }
        let stype: number, ctype: number, utag: number, body: Buffer;
        let cmd = ProtoBufManager.getInstance().decodeHeadMessage(message);
        if(cmd === null) return;
        stype   = cmd[0]; ctype   = cmd[1]; utag    = cmd[2];
        body = ProtoBufManager.getInstance().decodeBodyMessage(message);
        if(!this.serviceModulesMap[stype]) {
            logger.error(`没有找到stype: ${stype} 的自定义服务!`);
            return false;
        }
        if(this.serviceModulesMap[stype].isForwardService) {
            /** 发给gateway或者自定义服务 */
            this.serviceModulesMap[stype].onRecvClientMessageToGateway(client, stype, ctype, message);
            return true;
        }

        this.serviceModulesMap[stype].onRecvClientMessageToService(client, ctype, utag, body);
        return true;
    }
    /** 收到了自定义服务发送的消息 下行通道 */
    public onRecvServerMessage(client: WebSession, message: Buffer) {
        /** 加密消息需要解密 */
        if(client.isEncrypt) {
            ProtoBufManager.getInstance().decryptMessage(message);
        }
        let stype: number, ctype: number, utag: number, body: Buffer;
        let cmd = ProtoBufManager.getInstance().decodeHeadMessage(message);
        if(cmd === null) return;
        stype   = cmd[0]; ctype   = cmd[1]; utag    = cmd[2];
        body = ProtoBufManager.getInstance().decodeBodyMessage(message);

        if(!this.serviceModulesMap[stype]) {
            logger.error(`没有找到stype: ${stype} 的自定义服务!`);
            return false;
        }
        /** 发给gateway或者自定义服务 */
        if(this.serviceModulesMap[stype].isForwardService) {
            this.serviceModulesMap[stype].onRecvServerMessageFormGateway(client, stype, ctype, utag, message);
            return true;
        }

        this.serviceModulesMap[stype].onRecvClientMessageToService(client, ctype, utag, body);
        
        
        return true;  
    }
}