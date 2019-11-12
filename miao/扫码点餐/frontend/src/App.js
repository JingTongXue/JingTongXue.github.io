import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {HashRouter, Route,Switch} from 'react-router-dom';

import LandingPage from './LandingPage';
import FoodCart from './FoodCart';
import RestaurantManage from './RestaurantManage';
import Login from './Login';
import HomePage from './HomePage';
import OrderSuccess from './OrderSuccess';
import history from './history'
//路由
/**
 *  扫码进入的页面,选择人数:/landing/restaurant/35/desk/20  
 *  点餐页面:   /restaurant/35/desk/20
 *  点餐成功的页面: /
 * 
 *  商户侧
 *  登陆
 *  订单管理:/manage/order
 *  订单详情:/manage/order/35
 *  菜单管理:/manage/food
 *  桌面管理:/manage/desk
 * 
 * */

function App() {
  return (
    <HashRouter history={history}>
      <Switch>
        <Route path="/" exact component={HomePage}/>
        <Route path="/landing/r/:rid/d/:did" component={LandingPage}/>
        <Route path="/r/:rid/d/:did/c/:count" component={FoodCart}/>
        <Route path="/r/:rid/d/:did/o/:id/order-success" component={OrderSuccess}/>
        <Route path="/manage" component={RestaurantManage}/>
        <Route path="/login" component={Login}/>
      </Switch>
    </HashRouter>
  );
}

export default App;
