class Expresserrors extends Error {
    constructor(message,Statuscode){
        super();
        this.message=message;
        this.Statuscode=Statuscode;
    }
}

module.exports=Expresserrors;