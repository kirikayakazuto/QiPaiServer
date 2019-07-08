import { LoginPackage } from "./protobuf/login";
import * as log4js  from 'log4js';
import WebSession from "../../netbus/WebSession";
import ServerConfig from "../../config/ServerConfig";
import UserCenterCtype from "./UserCenterCtype";
/**
 * @Author: 邓朗 
 * @Date: 2019-06-27 10:19:40  
 * @Describe: 用户中心
 */
const logger = log4js.getLogger('console');
export default class UserCenterModel {
    private static instance: UserCenterModel = null;
    public static getInstance() {
        if(this.instance === null) {
            this.instance = new UserCenterModel();
        }
        return this.instance;
    }

    public stype       = ServerConfig.ServicesConfig.UserCenterService.stype;
    
    /** 游客登录 */
    public guestLogin(client: WebSession, utag: number, body: Buffer) {
        
        let obj = LoginPackage.GuestLoginRep.decode(body);
        logger.info(obj.guestKey);
        let resp = LoginPackage.GuestLoginResp.create({
            code: 1,
        });
        let uint8 = LoginPackage.GuestLoginResp.encode(resp).finish();
        client.sendMessage(this.stype, UserCenterCtype.GuestLogin, uint8, utag)
    }
}