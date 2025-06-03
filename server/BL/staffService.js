const BaseService = require("./baseService");
const staffRepository = require("../DAL/Repositories/staffRepositoty");
class StaffService extends BaseService{
    constructor(){
        super(staffRepository);
    }
    async delete(id, schoolid) {   
        let result = await this.repository.delete(id, schoolid);
        if (result)
        return result;
    }
}
let staffService = new StaffService();
module.exports = staffService;