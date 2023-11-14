import { RestService } from './restService';
import { UrlItem } from '../models/urlItem';

export class UrlService extends RestService<UrlItem> {
    public constructor(baseUrl: string, baseRoute: string) {
        super(baseUrl, baseRoute);
    }

    public async saveUrl(url: string): Promise<UrlItem> {
        const response = await this.client.request<UrlItem>({
            method: 'POST',
            data: {url: url}
        });

        return response.data;
    }
}
