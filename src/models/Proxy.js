/**
 * Created by hkamran on 7/7/2016.
 */
export class Proxy {
    constructor(id, port, name) {
        this.id = id;
        this.port = port;
        this.name = name;
    }

    static parseJSON(source) {
        var id = source["id"];
        var port = source["port"];
        var method = source["name"];

        return new Proxy(id, port, method);
    }

    clone() {
        return new Proxy(this.id,
            this.port,
            this.name);
    }

}