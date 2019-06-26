import ServiceConfig from "../config/ServicesConfig";
import Netbus from "../netbus/Netbus";
import ServiceManager from "../netbus/ServiceManager";
import GatewayService from "./GatewayService";

const host = ServiceConfig.GateWayConfig.host;
const port = ServiceConfig.GateWayConfig.port;

/** 开启网关服务 */
Netbus.getInstance().startWebSessionServer(host, port);
/** 在ServiceManager中注册网关 */
// ServiceManager.getInstance().registerServices(GatewayService.getInstance());