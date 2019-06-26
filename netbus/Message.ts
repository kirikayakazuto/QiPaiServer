export default class Message {
    stype: number;
    ctype: number;
    body: ArrayBuffer;
    uid: number;

    constructor(stype: number, ctype: number, body: ArrayBuffer, uid: number) {
        this.stype = stype;
        this.ctype = ctype;
        this.body = body;
        this.uid = uid;
    }
}