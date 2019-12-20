import React, { Component, useState } from 'react';
import io from 'socket.io-client';
import api from './api';
import { produce } from 'immer';
import 'antd/dist/antd.css';
import {  Button, Modal,  Card } from 'antd';
import './OrderManage.css';

var orderItemStyle = {
    margin: '5px',
    padding: '5px',
}

function OrderItem({ order, onDelete }) {
    var [orderInfo, setOrder] = useState(order);
    //确认订单
    function setConfirm() {
        api.put(`/restaurant/1/order/${order.id}/status`, {
            status: '确认'
        }).then(() => {
            setOrder({
                ...orderInfo,
                status: '确认',
            })
        })
    }
    //完成订单(已付)
    function setComplete() {
        api.put(`/restaurant/1/order/${order.id}/status`, {
            status: '完成'
        }).then(res => {
            console.log(res.data);
            
            setOrder({
                ...orderInfo,
                status: '完成',
            })
        })
    }
    
    //删除订单
    const { confirm } = Modal;
    function deleteOrder() {
        confirm({
            centered: true,
            width: '85vw',
            title: '您确定删除此订单吗?',
            cancelText: '取消',
            okText: '确定',
            onOk() {
                api.delete(`/restaurant/1/order/${order.id}`).then(() => {
                    onDelete(order)
                });
            },
        });
        
    }
    function printOrder(){
        Modal.info({
            centered:true,
            title: '抱歉,暂不支持打印功能',
            onOk() {},
          });
    }
    return (
        <div style={orderItemStyle}>
            <Card
                className="foodCard"
                hoverable
                style={{ width: '66vw', left: '-1.5vw', top: '-0.6vh', height: '28vh' }}
            >
                <h2>{orderInfo.deskName}桌</h2>
                <h3>总价格: {orderInfo.totalPrice}</h3>
                <h3>人数: {orderInfo.customCount}</h3>
                <h3>订单状态: {orderInfo.status} </h3>
                <div id="buttons">
                    <Button size='small' type="primary" onClick={printOrder}>打印</Button>
                    <Button size='small' type="primary" onClick={setConfirm}>确认</Button>
                    <Button size='small' type="primary" onClick={setComplete}>完成</Button>
                    <Button size='small' type="primary" onClick={deleteOrder}>删除</Button>
                </div>
            </Card>
        </div>

    )
}

export default class OrderManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: []
        }
    }

    componentDidMount() {
        var params = this.props.match.params;
        this.socket = io('ws://localhost:5000/');

        this.socket.on('connect', () => {
            this.socket.emit('join restaurant', 'restaurant:' + params.rid)
        })

        //监听new order事件
        this.socket.on('new order', order => {
            this.setState(produce(state => {
                state.orders.unshift(order)
            }))
        })

        api.get('/restaurant/1/order').then(res => {
            this.setState(produce(state => {
                state.orders = res.data
            }))
        })
    }

    componentWillUnmount() {
        this.socket.close()
    }
    // console.log(orders);
    //删除订单
    onDelete = (order) => {
        var idx = this.state.orders.findIndex(it => it.id == order.id);
        this.setState(produce(state => {
            state.orders.splice(idx, 1)
        }))
    }
    render() {
        return (
            <div>
                {/* <h2>订单管理</h2> */}
                <div>
                    {this.state.orders.length > 0 ?
                        this.state.orders.map(order => {
                            return <OrderItem onDelete={this.onDelete} key={order.id} order={order} />
                        })
                        :
                        <div>加载中.......</div>
                    }
                </div>
            </div>
        )

    }
}