import React, { useEffect, useContext, useMemo, useState } from 'react';
import { Stack, Text, TextField, DefaultButton } from '@fluentui/react';
import * as urlActions from '../actions/urlActions';
import { TodoContext } from '../components/todoContext';
import { AppContext } from '../models/applicationState';
import { UrlActions } from '../actions/urlActions';
import { stackItemPadding, stackPadding, titleStackStyles } from '../ux/styles';
import { useParams } from 'react-router-dom';
import { bindActionCreators } from '../actions/actionCreators';
import { withApplicationInsights } from '../components/telemetry';
import { UrlItem } from '../models/urlItem';

const HomePage = () => {
    const appContext = useContext<AppContext>(TodoContext)
    const { shorturl } = useParams();
    const actions = useMemo(() => ({
        urls: bindActionCreators(urlActions, appContext.dispatch) as unknown as UrlActions,
    }), [appContext.dispatch]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isRedirecting, setIsRedirecting] = useState(shorturl ? true : false);
    const [inputValue, setInputValue] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');

    const _checkRedirectionResponse = function(res: UrlItem) {
        console.log(res);
        if (res.url) {
          window.location.replace(res.url);
        } else {
          return Promise.reject(`Error`);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _checkPostResponse = function(res: any) {
        console.log(res);
        if (res.shortUrl) {
            setShortenedUrl(window.location.href.concat(res.shortUrl));
        } else {
          return Promise.reject(`Error`);
        }
      }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onUrlSubmit = function(evt: any) {
        evt.preventDefault();
        console.log(typeof(evt));
        console.log(evt);
        console.log('Submitted input:', inputValue);
        actions.urls.save(inputValue).then(_checkPostResponse);
    }

    // If there is a shorturl specified as parameter
    useEffect(() => {
        if (shorturl) {
            console.log("Redirecting soon...:", shorturl);
            actions.urls.load(shorturl).then(_checkRedirectionResponse);
        }
    }, [actions.urls, shorturl])
    

    return (
        <Stack>
            <Stack.Item>
                <Stack horizontal styles={titleStackStyles} tokens={stackPadding}>
                    {isRedirecting ? 
                        <h2>Redirecting, please wait...</h2> :
                        <h2>Please add your url to miniaturize</h2>}
                </Stack>
            </Stack.Item>
            {!isRedirecting && (
            <>
                <form>
                    <Stack.Item tokens={stackItemPadding}>
                        <TextField 
                        label='URL'
                        placeholder='Add your Url here'
                        aria-label='Field to add your url into'
                        value={inputValue}
                        onChange={(event) => setInputValue(event.currentTarget.value)}
                        />
                    </Stack.Item>
                    <Stack.Item tokens={stackItemPadding}>
                        <DefaultButton type="submit" onClick={onUrlSubmit}>Submit</DefaultButton>
                    </Stack.Item>
                </form>
                <Stack.Item tokens={stackItemPadding}>
                    <Text placeholder='Your miniaturized url will be displayed here'>{shortenedUrl}</Text>  
                </Stack.Item>
            </>)}
        </Stack >
    );
};

export default withApplicationInsights(HomePage, 'Homepage');