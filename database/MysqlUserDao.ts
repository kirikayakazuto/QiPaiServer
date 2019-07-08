import MySqlBaseDao from "./MysqlBaseDao";
import * as util from "util";
import UserInfo from "../model/UserInfo";
export default class MysqlUserDao {
    private static instance: MysqlUserDao = null;
    public static getInstance() {
        if(this.instance === null) {
            this.instance = new MysqlUserDao();
        }
        return this.instance;
    }

    /** 获取的所有角色信息 */
    public async getUserInfoByUid(uid: number) {
        let sql = "select * from user_info where uid = %d limit 1";
        let sqlCmd = util.format(sql, uid);

        return await MySqlBaseDao.getInstance().executeSql(sqlCmd);
    }
    /** 添加一个用户 */
    public async insertUserInfo(userInfo: UserInfo) {
        let sql = "insert into user_info(account, password, nickName) values(?, ?, ?)";
        let sqlCmd = util.format(sql, userInfo.account, userInfo.password, userInfo.nickName);

        return await MySqlBaseDao.getInstance().executeSql(sqlCmd);
    }

    public async setUserNickName(nickName: string) {
        
    }



    
}