const BaseService = require("./baseService");
const staffRepository = require("../DAL/Repositories/staffRepositoty");
class StaffService extends BaseService{
    constructor(){
        super(staffRepository);
    }
    async getBySchoolId(schoolId) {   
        let result = await this.repository.getBySchoolId(schoolId);
        if (result)
        return result;
    }
    async getBySchoolIdAndId(schoolId,id) {   
        let result = await this.repository.getBySchoolIdAndId(schoolId,id);
        if (result)
        return result;
    }
    async updateName(id, updatedFields) {   
        let result = await this.repository.updateConfirm(id, updatedFields);
        if (result)
        return result;
    }
}
let staffService = new StaffService();
module.exports = staffService;