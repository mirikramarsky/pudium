const BaseService = require("./baseService");
const staffRepository = require("../DAL/Repositories/staffRepositoty");
const idError = require("./errors/idError");
class StaffService extends BaseService{
    constructor(){
        super(staffRepository);
    }
    async getBySchoolId(schoolId) {   
        let result = await this.repository.getBySchoolId(schoolId);
          if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    }
    async getBySchoolIdAndId(schoolId,id) {   
        let result = await this.repository.getBySchoolIdAndId(schoolId,id);
         if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    }
    async updateName(id, updatedFields) {   
        let result = await this.repository.updateName(id, updatedFields);
         if (result != 0)
            return result;
       throw new idError('this id is not exist');
    }
    async delete(id,schoolId) {   
        let result = await this.repository.delete(id, schoolId);
        if(result != 0)
            return result;
        throw new idError('this id is not exist');
    }
}
let staffService = new StaffService();
module.exports = staffService;