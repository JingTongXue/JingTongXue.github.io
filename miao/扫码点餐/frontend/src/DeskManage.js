import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import 'antd/dist/antd.css';
import { Button, Modal, Card, Popconfirm, message } from 'antd';
import './DeskManage.css'

function DeskItem({ desk, onDelete }) {
    // var [deskInfo,setDeskInfo] = useState(desk);

    function confirm(e) {
        console.log(e);
        message.success('Click on Yes');
        api.delete('/restaurant/1/desk/' + desk.id).then(() => {
            onDelete(desk.id);
        })
    }

    function cancel(e) {
        console.log(e);
        message.error('Click on No');
    }
    // function deleteDesk() {
    // }

    return (
        <div>
            <Card
                className="foodCard"
                hoverable
                style={{ width: '66vw', left: '1.3vw', top: '1.4vh', height: '8vh' }}
            >
                <p class='p1'>{desk.name}号桌</p>
                <p class='p2'>人数:{desk.capacity}</p>
                <Popconfirm
                    title="您确认删除此桌面吗?"
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText="确认"
                    cancelText="取消"
                >
                    {/* <a href="#">Delete</a> */}
                    <Button type='primary' id="button"
                    // onClick={deleteDesk}
                    >删除</Button>
                </Popconfirm>
            </Card>

        </div>
    )
}

export default function DeskManage() {
    var [desks, setDesks] = useState([]);
    //获取桌面信息
    useEffect(() => {
        api.get('/restaurant/1/desk').then(res => {
            setDesks(res.data);
        })
    }, []);
    console.log(desks);
    function onDelete(id) {
        setDesks(desks.filter(it => it.id !== id));
    }
    return (
        // <div>123</div>
        <div>
            <Link to="/restaurant/1/manage/add-desk">添加桌面</Link>
            <div>
                {
                    desks.map(desk => {
                        return <DeskItem desk={desk} onDelete={onDelete} />
                    })
                }
            </div>
        </div>
    )
}