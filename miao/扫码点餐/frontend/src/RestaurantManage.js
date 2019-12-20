import React,{ Suspense } from 'react';
import { Route,Switch,Link,withRouter } from 'react-router-dom';
import OrderManage from './OrderManage';
import FoodManage from './FoodManage';
import DeskManage from './DeskManage';
import AddFood from './AddFood';
import api from './api';
import createFetcher from './create-fetcher'
import history from './history';
import FoodAmend from './FoodAmend';
import AddDesk from './AddDesk';
import { Layout, Menu, Breadcrumb, Icon,Button,Modal } from 'antd';

var div ={
  'minheight':'100%',
}

var headerdiv = {
    // 'margin':'-60px 100px',
    'position':'absolute',
    'left':'170px',
    'top':'0px',
}

var headerp = {
    'font-size':'24px',
}

var headerp1 = {
    'position':'absolute',
    'font-size':'18px',
    'left':'122px',
    'top':'17.5px',
    'width':'100px'
}

const userInfoFetcher = createFetcher(async () => {
    return api.get('/userinfo').catch(() => {
        history.push('/');
    })
})

function RestaurantInfo(){
    var info = userInfoFetcher.read().data;
    console.log(info);
    
    return (
        <div style={headerdiv}>
            <p style={headerp}>{info &&  info.title}</p>
            <p style={headerp1}>{info && '管理员:' + info.name }</p>
         </div>
    )
}

const { confirm } = Modal;

export default withRouter(function(props){
    const { SubMenu } = Menu;
    const { Header, Content, Sider } = Layout;
    console.log("=========================+" , history === props.history );

    //登出
    function logout(){
      confirm({
        centered:'true',
        title: '您确定要点击登出吗?',
        okText:'确定',
        cancelText:'取消',
        onOk() {
          console.log('OK');
          api.get('./logout');
          userInfoFetcher.clearCode();
          props.history.push('/')
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }

    return (
        <div style={ div }>
            <Layout>
              <Header style={{"position":"relative","background-color":"white"}} className="header">
                  <Button style={ { margin:'-40px', } } onClick={logout} type="primary" shape="round">
                      <Icon type="left" />
                  </Button>
                  <Suspense fallback={<div>加载中...</div>}>
                      <RestaurantInfo />
                  </Suspense>
              </Header>
            <Layout>
              <Sider width={95} style={{ background: '#fff','min-height':'95vh','min-width':'45vh' }}>
                <Menu
                  style={{ width: 95 }}
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  mode={'vertical'}
                  theme={'light'}
                >
                  <Menu.Item key="1">
                    <span><Link to="order">订单管理</Link></span>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <span><Link to="food">菜单管理</Link></span>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <span><Link to="desk">桌面管理</Link></span>
                  </Menu.Item>
                </Menu>
              </Sider>
              <Layout style={{ padding: '0 6px 6px',width:150 }}>
                <Breadcrumb style={{ margin: '8px 0' }}>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                  style={{
                    background: '#fff',
                    padding: 12,
                    margin: 0,
                    minHeight: 140,
                  }}
                >
                  <main>
                        <Switch>
                            <Route path="/restaurant/:rid/manage/order" component={OrderManage} />
                            <Route path="/restaurant/:rid/manage/food" component={FoodManage} />
                            <Route path="/restaurant/:rid/manage/desk" component={DeskManage} />
                            <Route path="/restaurant/:rid/manage/add-food" component={AddFood} />
                            <Route path='/restaurant/:rid/manage/add-desk' component={AddDesk}/>
                            <Route path='/restaurant/:rid/manage/:fid' component={FoodAmend}/>
                        </Switch>
                    </main>
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </div>
    )
})