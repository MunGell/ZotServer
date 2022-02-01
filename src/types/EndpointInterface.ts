export default interface EndpointInterface {
    supportedMethods: string[];
    supportedDataTypes: string[];
    permitBookmarklet: boolean;

    init(request: any): Promise<any[]>;
}
