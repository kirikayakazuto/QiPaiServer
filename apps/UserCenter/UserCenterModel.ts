import WebSession from "../../netbus/WebSession";
import { LoginPackage } from "./protobuf/login";
import * as log4js  from 'log4js';
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
    /** 游客登录 */
    public guestLogin(utag: number, body: Buffer) {
        let obj = LoginPackage.GuestLoginRep.decode(body);
        logger.info(obj.guestKey);
    }
}