/**
 * Created by hkamran on 7/7/2016.
 */
export class Proxy {
    constructor(id, port, name, status) {
        this.id = id;
        this.port = port;
        this.name = name;
        this.status = status;
    }

    static parseJSON(source) {
        var id = source["id"];
        var port = source["port"];
        var method = source["name"];
        var state = source["status"];

        return new Proxy(id, port, method, state);
    }

    clone() {
        return new Proxy(this.id,
            this.port,
            this.name,
            this.status);
    }
}

Proxy.types = {
    valueOf : function(source) {
        if (source.localeCompare(Proxy.types.START) == 0) {
            return Proxy.types.START;
        } else if (source.localeCompare(Proxy.types.STOP) == 0) {
            return Proxy.types.STOP;
        } else {
            return Proxy.types.NONE;
        }
    },

    cmp : function(a, b) {
        return (a.localeCompare(b) == 0);
    }
};

Proxy.types.START = "START";
Proxy.types.STOP = "STOP";
Proxy.types.NONE = "NONE";