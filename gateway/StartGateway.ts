import ServerConfig from "../config/ServerConfig";
import Netbus from "../netbus/Netbus";
import ServiceManager from "../netbus/ServiceManager";
import GatewayService from "./GatewayService";
import { AdminService } from "./AdminService";
import GatewayModel from "./GatewayModel";
import "../logs/logger";

const host = ServerConfig.GateWayConfig.GateWayService.host;
const port = ServerConfig.GateWayConfig.GateWayService.port;
const AdminStype = ServerConfig.GateWayConfig.AdminService.stype;
const servicesConfig = ServerConfig.ServicesConfig;

/** 开启网关服务 */
Netbus.getInstance().startWebSessionServer(host, port);
GatewayModel.getInstance().init();
/** 在ServiceManager中注册网关 */
for(let key in servicesConfig) {
    Netbus.getInstance().connectWebsocketServer(servicesConfig[key].stype, servicesConfig[key].host, servicesConfig[key].port);
    ServiceManager.getInstance().registerServices(servicesConfig[key].stype, GatewayService.getInstance());
}
/** 注册UserService */
ServiceManager.getInstance().registerServices(AdminStype, new AdminService());

