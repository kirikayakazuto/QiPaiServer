import * as log4js  from 'log4js';
import * as ws from "ws";
import WebSession from "./WebSession"
import ServiceManager from './ServiceManager';
/**
 * @Author: 邓朗 
 * @Date: 2019-06-23 17:50:59  
 * @Describe: netbus
 */
const logger = log4js.getLogger();
export default class Netbus {
    /** 单例 */
    private static instance: Netbus = null;
    public static getInstance() {
        if(this.instance === null) {
            this.instance = new Netbus();
        }
        return this.instance;
    }

    /** 全局socket引用 */
    private globalSessionMap: {[key: string]: WebSession} = {};
    private globalSessionKey = 1;

    /** 开启WebSession服务 */
    public startWebSessionServer(ip: string, port: number) {
        logger.info(`ws.Server已开启, ip: ${ip} port:${port}`);
        const server = new ws.Server({
            port: port
        });
        server.on("connection", (client: WebSession) => {
            this._addClientSessionEvent(client);
        });
        server.on("error",      () => {

        })
    }
    /** 获得一个客户端连接 */
    public getClientBySessionKey(sessionKey: number) {
        if(!this.globalSessionMap[sessionKey]) {
            logger.error(`没有找着客户端session, key:${sessionKey}`)
            return null;
        }
        return this.globalSessionMap[sessionKey];
    }

    /** 为client添加监听事件 */
    private _addClientSessionEvent(client: WebSession) {
        client.binaryType = "arraybuffer";

        client.addEventListener("open",    () => {
            logger.info(`有一个客户端连接上了!`);
        });
        client.addEventListener("message", (event: MessageEvent) => {
            if(!Buffer.isBuffer(event.data)) {
                logger.error(`客户端传来一个未知信息, 准备将该客户端关闭!: ${event.data}`);
                this.clientExit(client);
                return ;
            }
            this.onClientRecvMessage(client,  event.data);
        });

        client.addEventListener("close",    () => {
            this.clientExit(client);
        });

        client.addEventListener("error",    (error: any) => {
            logger.error(`服务出现了一个错误: ${error}`);
        });

        this.clientEnter(client);
    }


    /** 客户端进入server */
    private clientEnter(client: WebSession) {
        client.isEncrypt = false;
        client.sessionKey = this.globalSessionKey ++;
        this.globalSessionMap[client.sessionKey] = client;
        logger.info(`有一个client进入, key: ${client.sessionKey}`)
    }
    /** 客户端退出 */
    public clientExit(client: WebSession) {
        logger.info(`有一个client退出, key: ${client.sessionKey}`);
        ServiceManager.getInstance().onClientDisconnect(client);
        this._clientClose(client);
        if(this.globalSessionMap[client.sessionKey]) {
            this.globalSessionMap[client.sessionKey] = null;
            delete this.globalSessionMap[client.sessionKey];
        }
    }
    /** 主动关闭一个client */
    private _clientClose(client: WebSession) {
        if(client.readyState === client.CLOSED || client.readyState === client.CLOSING) {
            return ;
        }
        client.close();
        client = null;
    }

    /** 监听客户端传来的消息 */
    private onClientRecvMessage(client: WebSession, data: Buffer) {
        /** 把消息发给gateway 判断消息是否接收成功 */
        if(!ServiceManager.getInstance().onRecvClientMessage(client, data)) {
            this.clientExit(client);
        }
    }

    // ----------------- 分割线, 上面是玩家客户端与netbus之间的通讯, 下面是netbus与service之间的通讯 -----------------

    /** 自定义服务 通讯通道 */
    private serverSessionMap: {[key: string]: WebSession} = {};

    /** 连接上自定义服务器 */
    public connectWebsocketServer(stype: number, host: string, port:number) {
        logger.info(`netbus连接上了 stype:${stype}, host:${host}, port:${port}的service`);
        const server: WebSession = new WebSocket(`ws://${host}:${port}`);
        server.binaryType = "arraybuffer";
        
        server.addEventListener("open",     () => {
            server.sessionKey = stype;
            this.serverEnter(server);
        });

        server.addEventListener("message",  (event: MessageEvent) => {
            if(!Buffer.isBuffer(event.data)) {
                logger.error(`客户端传来一个未知信息, 准备将该客户端关闭!: ${event.data}`);
                return ;
            }
            this.onServerRecvMessage(server,  event.data);
        });

        server.addEventListener("close",    () => {
            this.serverExit(server);
            // service断线重连
            setTimeout(() => {
                this.connectWebsocketServer(stype, host, port);
            }, 3000);
        });

        server.addEventListener("error",    (error: any) => {
            logger.error(`服务出现了一个错误: ${error}`);
            this.serverExit(server);
        });        
    }
    public getServerBySessionKey(sessionKey: number) {
        if(!this.serverSessionMap[sessionKey]) {
            logger.error(`没有找到stype:${sessionKey} 的service`);
            return null;
        }
        return this.serverSessionMap[sessionKey];
    }

    /** service进入 */
    private serverEnter(server: WebSession) {
        server.isEncrypt = false;
        if(this.serverSessionMap[server.sessionKey]) {
            logger.warn(`service重复注册! key: ${server.sessionKey}`);
        }
        this.serverSessionMap[server.sessionKey] = server;
    }
    public serverExit(server: WebSession) {
        logger.error(`stype:${server.sessionKey}的service 断开了连接!`);
        this._serverClose(server);
        this.serverSessionMap[server.sessionKey] = null;
        delete this.serverSessionMap[server.sessionKey];
    }
    private _serverClose(server: WebSession) {
        if(server.readyState === server.CLOSED || server.readyState === server.CLOSING) {
            return ;
        }
        server.close();
        server = null;
    }

    private onServerRecvMessage(client: WebSession, data: Buffer) {
        if(!ServiceManager.getInstance().onRecvServerMessage(client, data)) {
            this.serverExit(client);
        }
    }
}


 
