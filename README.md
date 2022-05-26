# ZotServer for Zotero

ZotServer provides locally accessible HTTP API.
This is a convenient way to integrate Zotero with other desktop applications that require access to its database.

My motivation for development of this addon is to connect my note-taking software to Zotero database without active internet connection.
I am working on a [connector](https://github.com/MunGell/obsidian-zotero) that will allow me to quickly search and link to Zotero items right from the text editor.

## Installation

1. Download lastest stable version of the addon from [GitHub release page of this repository](https://github.com/MunGell/ZotServer/releases/)
2. Use "Install addon from file" menu link in Zotero and select the downloaded `.xpi` file

> How to find "Install addon from file" option:
> 1. Go to "Tools" menu, click on "Add-ons" option
> 2. Click on a cog icon on top right corner
> 3. There now should be "Install Add-on From File" option

## Alternatives

Zotero already provides a couple of ways to access its database:

1. [Direct access to SQLite database](https://www.zotero.org/support/dev/client_coding/direct_sqlite_database_access)
2. [Web API of Zotero Storage service](https://www.zotero.org/support/dev/web_api/v3/start)

ZotServer addon provides a third way with local-only HTTP API that uses [JavaSceript API](https://www.zotero.org/support/dev/client_coding/javascript_api) internally.

## Implementation

Zotero is already coming with an [HTTP server implementation](https://github.com/zotero/zotero/blob/master/chrome/content/zotero/xpcom/server.js) that runs on port `23119`.
It serves [browser connector endpoints](https://github.com/zotero/zotero/blob/master/chrome/content/zotero/xpcom/connector/server_connector.js) to add new items to Zotero database.

ZotServer relies on the original implementation of the server and augments it with new endpoints to serve functionality like [database search](https://github.com/MunGell/ZotServer/blob/main/src/endpoints/Search.ts)

## Endpoint Security

Please see [discussion](https://github.com/MunGell/ZotServer/issues/1) for more information.

## Documentation

### Search

`POST /zotserver/search`

A search endpoint that expects POST request with JSON body that describes [search conditions](https://www.zotero.org/support/dev/client_coding/javascript_api#zotero_search_basics).

Example JSON body:

```json
[
    {
        "condition": "quicksearch-everything",
        "value": "Ahrens"
    },
    {
        "condition": "tag",
        "operator": "is",
        "value": "productivity"
        "required": true
    }
]
```

JSON body contains an array of search conditions.
Each search condition can have following fields:

|Field      |Required|Defaults To|
|-----------|--------|-----------|
|`condition`| Yes    | None      |
|`operator` | No     |`contains` |
|`value`    | Yes    | None      |
|`required` | No     |`false`    |

Following conditions are accepted:

| Condition                      | Description                                                          | Default Operator   |
|--------------------------------|----------------------------------------------------------------------|--------------------|
| `quicksearch-everything`       | Search on all item fields, similar to search field in Zotero UI      | `contains`         |
| `quicksearch-titleCreatorYear` | Search on title, creator and year fields                             | `contains`         |
| `tag`                          | Search on a particular tag                                           | None               |

Some more conditions are described here: [Zotero JavaScript API on search](https://www.zotero.org/support/dev/client_coding/javascript_api#zotero_search_basics)

## Roadmap

Current roadmap is basically based on the idea of parity with [functionality](https://www.zotero.org/support/dev/web_api/v3/basics) of [Zotero Storage](https://www.zotero.org/storage).

## Contributing

ZotServer is written with [TypeScript](https://www.typescriptlang.org) and main source code is located under `src` directory.

I am assuming that the majority of contributions will be dealing with existing or new endpoints. Below is an overview of endpoints structure.

All endpoint code should be placed in `src/endpoints` directory in a file named after the class it contains.

A simple template for such file is below:

```js
import EndpointInterface from '../types/EndpointInterface';

export default class Collections implements EndpointInterface {
    supportedMethods = ['GET','POST','PUT','DELETE'];
    supportedDataTypes = ['application/json'];
    permitBookmarklet = false;

    public async init(request: any) {
        return [200, 'application/json', JSON.stringify('response data')];
    }
}
```

`init` is the main method that should return a response array in specified format: `[<http response code>, <response content type>, <response body>]`.

Example `request` object (for search endpoint in this particular case):

```json
{
    "method": "POST",
    "pathname": "/zotserver/search",
    "query": {},
    "headers": {
        "Content-Type": "application/json",
        "User-Agent": "browser",
        "Accept": "*/*",
        "Cache-Control": "no-cache",
        "Host": "localhost:23119",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Content-Length": "89"
    },
    "data": [
        { "condition": "quicksearch-everything", "value": "Ahrens"}
    ]
}
```

You will then need to register this new endpoint in `zotserver.ts` file and assing it unique url path.

Endpoints implementation relies on [Zotero JavaScript API](https://www.zotero.org/support/dev/client_coding/javascript_api).

For more information on addon development workflow please refer to [Zotero Plugin Development](https://www.zotero.org/support/dev/client_coding/plugin_development) page.

Here is my command to run Zotero in development mode that you might find useful:

```sh
/Applications/Zotero.app/Contents/MacOS/zotero -p <your-development-profile-name> -ZoteroDebugText -jsconsole -purgecache
```

Your contributions are highly appreciated!

## License

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
