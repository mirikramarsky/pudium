const searchRepository = require("../DAL/Repositories/searchRepositry");
const BaseService = require("./baseService");
class SearchService extends BaseService{
    constructor(){
        super(searchRepository);
    }
    async getByParams(params) {   
        let result = await this.repository.getByParams(params);
        if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    }
}
let searchService = new SearchService();
module.exports = searchService;