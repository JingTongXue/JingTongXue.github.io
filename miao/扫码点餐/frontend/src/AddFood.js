import React, { useState } from 'react';
import history from './history';
import api from './api';




function AddFood(props) {
    function change(e) {
        setFoodInfo({
            ...foodInfo,
            [e.target.name]: e.target.value
        })
    }
    var [foodInfo, setFoodInfo] = useState({
        name: '',
        desc: '',
        price: 0,
        category: '',
        status:'on',
        img:null,
    })

    function submit(e){
        e.preventDefault();
        var fd = new FormData();
        for(var key in foodInfo){
            var val = foodInfo[key];
            fd.append(key,val);
        }

        api.post('/restaurant/1/food',fd).then(res => {
            history.goBack();
        })
    }
    function imgChange(e){
        setFoodInfo({
            ...foodInfo,
            img: e.target.files[0],
        })
    }

    return (
        <div>
            <h2>添加菜品</h2>
            <form onSubmit={submit}>
                名称:<input type="text" onChange={change} defaultValue={foodInfo.name} name="name" />
                描述:<input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc" />
                价格:<input type="text" onChange={change} defaultValue={foodInfo.price} name="price" />
                分类:<input type="text" onChange={change} defaultValue={foodInfo.category} name="category" />
                图片:<input type="file" onChange={imgChange} name="img" /><br/>
            <button>提交</button>
            </form>
        </div>
    )
}

export default AddFood;



