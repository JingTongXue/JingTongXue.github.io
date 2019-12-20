import React, { useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import 'antd/dist/antd.css';
import history from './history';
import './FoodManage.css';
import { Form, Icon, Input, Button, Modal, InputNumber, Radio, Upload, Card, Avatar } from 'antd';

var imgStyle = {
    padding: '0.5vh',
    width: '65.5vw',
    height: '66vw',
    objectFit: 'cover',
}
var foodName = {
    'text-align': 'center',
    'font-size': '20px',
}

function FoodItem({ food, onDelete }) {
    var [foodInfo, setFoodInfo] = useState(food);
    var [foodProps, setFoodProps] = useState({
        name: food.name,
        desc: food.desc,
        price: food.price,
        category: food.category,
        status: food.status,
        img: null,
    })
    function change(e) {
        setFoodProps({
            ...foodProps,
            [e.target.name]: e.target.value
        })
    }
    
    //删除菜品
    const { confirm } = Modal;
    function deleteFood() {
        confirm({
            centered: true,
            width: '85vw',
            title: '您确定删除此菜品吗?',
            cancelText: '取消',
            okText: '确定',
            onOk() {
                api.delete('/restaurant/1/food/' + food.id).then(() => {
                    onDelete(food.id);
                })
            },
        });
    }

    //上架下架
    function setOnline() {
        api.put(`/restaurant/1/foods/${food.id}`, {
            status: 'on',
        }).then(res => {
            setFoodInfo(res.data)
        })
    }
    function setOffline() {
        api.put(`/restaurant/1/foods/${food.id}`, {
            status: 'off',
        }).then(res => {
            setFoodInfo(res.data)
        })
    }

    function getContent() {
        const { Meta } = Card;
        return (
            <div >
                <Card
                    className="foodCard"
                    hoverable
                    style={{ width: '66vw', left: '-6vw', top: '-3.6vh', height: '58vh' }}
                    cover={<img src={'http://localhost:5000/upload/' + foodInfo.img} alt={foodInfo.name} style={imgStyle} />}
                >
                    <h3 style={foodName}>{foodInfo.name}</h3>
                    <p>描述:{foodInfo.desc}</p>
                    <p>价格:{foodInfo.price}</p>
                    <p>分类:{foodInfo.category ? foodInfo.category : '[暂未分类]'}</p>
                </Card>
            </div>
        )
    }


    //修改菜品
    function Amend() {
        console.log('11111');
        api.get(`/restaurant/:rid/food/${food.id}`).then(res => {
            console.log(res.data);
            history.push(`/restaurant/1/manage/${res.data.id}`);
        })
    }
    var { Meta } = Card;
    return (
        <div id='foodInfo'>
            <Card
                style={{ width: '66vw', left: '1.5vw', top: '2vh', height: '63vh', position: 'relative' }}
            >
                {getContent()}
                <div id='card'>
                    {foodInfo.status === 'off' &&
                        <Button type="primary" onClick={setOnline}>上架</Button>
                    }
                    {foodInfo.status === 'on' &&
                        <Button type="primary" onClick={setOffline}>下架</Button>
                    }
                    <Button type="primary" onClick={() => Amend()}>修改</Button>
                    <Button type="primary" onClick={deleteFood}>删除</Button>
                </div>
            </Card>
        </div>
    )
}

export default function FoodManage() {
    var [foods, setFoods] = useState([]);
    //获取菜品信息
    useEffect(() => {
        api.get('/restaurant/1/food').then(res => {
            setFoods(res.data);
        })
    }, [])
    console.log(foods)

    function onDelete(id) {
        setFoods(foods.filter(it => it.id !== id));
    }


    return (
        <div>
            <Link to="/restaurant/1/manage/add-food">添加菜品</Link>
            <div>
                {
                    foods.map(food => {
                        return <FoodItem onDelete={onDelete} key={food.id} food={food} />
                    })
                }
            </div>

        </div>
    )
}

