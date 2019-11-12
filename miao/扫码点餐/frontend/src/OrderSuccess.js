import React,{ useState,useEffect } from 'react';
import api from './api';
import { useParams } from 'react-router-dom';

export default function(props){
    var params = useParams();
    console.log(params.id)
    var [order,setOrderInfo] = useState(null);
    useEffect(() => {
        api.get(`/restaurant/${params.id}/oorder`).then(val => {
            setOrderInfo(val);
        })
    },[])
    console.log(order);


    return (
        <div>
            <h2>下单成功</h2>
            <p>总价: {order && order.data.totalPrice} </p>
        </div>
    )


}