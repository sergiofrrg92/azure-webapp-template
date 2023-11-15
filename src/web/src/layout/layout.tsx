import React, { FC, ReactElement, useContext, useEffect, useMemo } from 'react';
import Header from './header';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/homePage';
import { Stack } from '@fluentui/react';
import { AppContext } from '../models/applicationState';
import { TodoContext } from '../components/todoContext';
import * as itemActions from '../actions/itemActions';
import * as listActions from '../actions/listActions';
import { ListActions } from '../actions/listActions';
import { ItemActions } from '../actions/itemActions';
import { headerStackStyles, mainStackStyles, rootStackStyles, sidebarStackStyles } from '../ux/styles';
import { bindActionCreators } from '../actions/actionCreators';

const Layout: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(TodoContext)
    const actions = useMemo(() => ({
        lists: bindActionCreators(listActions, appContext.dispatch) as unknown as ListActions,
        items: bindActionCreators(itemActions, appContext.dispatch) as unknown as ItemActions,
    }), [appContext.dispatch]);

    // Load initial lists
    useEffect(() => {
        if (!appContext.state.lists) {
            actions.lists.list();
        }
    }, [actions.lists, appContext.state.lists]);

    return (
        <Stack styles={rootStackStyles}>
            <Stack.Item styles={headerStackStyles}>
                <Header></Header>
            </Stack.Item>
            <Stack horizontal grow={1}>
                <Stack.Item styles={sidebarStackStyles}>
                    <div></div>
                </Stack.Item>
                <Stack.Item grow={1} styles={mainStackStyles}>
                    <Routes>
                        <Route path="/:shorturl" element={<HomePage />} />
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </Stack.Item>
                <Stack.Item styles={sidebarStackStyles}>
                    <div></div>
                </Stack.Item>
            </Stack>
        </Stack>
    );
}

export default Layout;
