import EndpointInterface from '../types/EndpointInterface';

// @todo: consider auth login through abstract class
export default class Search implements EndpointInterface {
    // @todo: move those into either decorators or interface
    supportedMethods = ['POST'];
    supportedDataTypes = ['application/json'];
    permitBookmarklet = false;

    public async init(request: any) {
        // @todo: validate request data
        const searchResults = await this.search(request.data);
        const items = await Zotero.Items.getAsync(searchResults);
        // @todo: improve response handing
        return [200, 'application/json', JSON.stringify(items)];
    }

    private search(conditions: any[]) {
        const s = new Zotero.Search();
        s.libraryID = Zotero.Libraries.userLibraryID;

        // @todo: make all "everything" queries be "contains"
        // @todo: docs on possible conditions and operators wouldn't hurt here
        conditions.forEach(({ condition, operator = 'contains', value, required = true}) => {
            s.addCondition(condition, operator, value, required)
        });

        return s.search();
    }
}
