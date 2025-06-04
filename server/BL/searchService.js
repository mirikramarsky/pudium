const searchRepository = require("../DAL/Repositories/searchRepository");
class SearchService extends BaseService{
    constructor(){
        super(searchRepository);
    }
    async getByParams(params) {   
        let result = await this.repository.getByParams(params);
        if (result)
        return result;
    }
}
let searchService = new SearchService();
module.exports = searchService;