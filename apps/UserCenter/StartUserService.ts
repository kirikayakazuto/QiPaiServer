import ServerConfig from "../../config/ServerConfig";
import Netbus from "../../netbus/Netbus";
import ServiceManager from "../../netbus/ServiceManager";
import UserCenterService from "./UserCenterService";
import "../../logs/logger";
/**
 * @Author: 邓朗 
 * @Date: 2019-06-27 10:59:06  
 * @Describe: 开启UserCenterService服务
 */
const host = ServerConfig.ServicesConfig.UserCenterService.host;
const port = ServerConfig.ServicesConfig.UserCenterService.port;
const stype = ServerConfig.ServicesConfig.UserCenterService.stype;

Netbus.getInstance().startWebSessionServer(host, port);

ServiceManager.getInstance().registerServices(stype, new UserCenterService());

