import Search from './methods/search';

export default class ZotServer {

    public start() {
        Zotero.Server.Endpoints['/zotserver/search'] = Search
    }

}
