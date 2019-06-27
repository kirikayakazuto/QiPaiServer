import WebSession from "../netbus/WebSession";
import ProtoBufManager from "../netbus/ProtoBufManager";
import Netbus from "../netbus/Netbus";
import * as log4js  from 'log4js';
import ServiceInterface from "../netbus/ServiceInterface";
import GatewayModel, { CommandType } from "./GatewayModel";

/**
 * @Author: 邓朗 
 * @Date: 2019-06-25 12:09:51  
 * @Describe: 系统服务, 用于网关转发
 */
const logger = log4js.getLogger('console');
export default class GatewayService implements ServiceInterface {
    private static instance: GatewayService = null;
    public static getInstance(): GatewayService {
        if(!this.instance) {
            this.instance = new GatewayService();
        }
        return this.instance;
    }

    public stype = 100;
    public serviceName = "GatewayService";
    public isForwardService = true;

    /** 初始化 */
    public init() {}
    /** 收到客户端的消息, 将其转发给对应的自定义服务 */
    public onRecvClientMessageToGateway(client: WebSession, stype: number, ctype: number, message: Buffer) {
        logger.info(`gatewayService收到消息 stype: ${stype}, ctype:${ctype}`)
        let utag = 0;
        let type = GatewayModel.getInstance().getCommandTypeOfMessage(stype, ctype);
        switch(type) {
            case CommandType.BeforLogin:
            case CommandType.Login:
                utag = client.sessionKey;
            break;
            case CommandType.Normal:
                if(client.uid === undefined || client.uid === 0) {
                    logger.error(`当前用户没有登录, client.uid: ${client.uid}`);
                    return ;
                }
                utag = client.uid;
            break;
        }
        ProtoBufManager.getInstance().writeUtagToMessage(message, utag);
        // 查询是否有对应的自定义服务
        let serverService = Netbus.getInstance().getServerBySessionKey(stype);
        if(!serverService) {
            logger.error(`没有stype:${stype}的自定义服务!`);
            return ;
        }
        serverService.send(message);
    }

    /** 收到自定义服务的消息, 将其发给客户端 */
    public onRecvServerMessageFormGateway(client: WebSession, stype: number, ctype: number, utag: number, message: Buffer) {
        let clientSession: WebSession = null;
        let type = GatewayModel.getInstance().getCommandTypeOfMessage(stype, ctype);
        switch(type) {
            case CommandType.BeforLogin:
            case CommandType.Login:
                clientSession = Netbus.getInstance().getClientBySessionKey(utag);
            break;
            case CommandType.Normal:
                clientSession = GatewayModel.getInstance().getLoginSessionByUid(utag);
            break;
        }
        ProtoBufManager.getInstance().clearUtagToMessage(message);
        if(!clientSession) {
            logger.error(`将消息发给客户端时, 无法找到对应clien的websession, sessionKey: ${utag}`);
            return ;
        }
        clientSession.send(message);
    }
    /** 收到玩家掉线的通知 */
    public onClientDisconnect(uid: number) {

    }

    
}
