import { Dispatch } from "react";
import { ActionTypes } from "./common";
import config from "../config"
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { UrlItem } from "../models/urlItem";
import { UrlService } from "../services/urlService";

export interface UrlActions {
    load(shorturl: string): Promise<UrlItem>
    save(url: string): Promise<UrlItem>
}

export const load = (shorturl: string): ActionMethod<UrlItem> => async (dispatch: Dispatch<LoadUrlItemAction>) => {
    const urlService = new UrlService(config.api.baseUrl, `/shorturl/${shorturl}`);
    const url = await urlService.getWithoutUrl();

    dispatch(loadUrlItemAction([url]));

    return url;
}

export const save = (url: string): ActionMethod<UrlItem> => async (dispatch: Dispatch<SaveUrlItemAction>) => {
    const urlService = new UrlService(config.api.baseUrl, ``);
    const newUrl = await urlService.saveUrl(url);

    dispatch(saveUrlItemAction(newUrl));

    return newUrl;
}

export interface LoadUrlItemAction extends PayloadAction<string, UrlItem[]> {
    type: ActionTypes.LOAD_URL_ITEM
}

export interface SaveUrlItemAction extends PayloadAction<string, UrlItem> {
    type: ActionTypes.SAVE_URL_ITEM
}

const loadUrlItemAction = createPayloadAction<LoadUrlItemAction>(ActionTypes.LOAD_URL_ITEM);
const saveUrlItemAction = createPayloadAction<SaveUrlItemAction>(ActionTypes.SAVE_URL_ITEM);

