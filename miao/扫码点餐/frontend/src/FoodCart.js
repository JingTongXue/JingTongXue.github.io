import React, { Component, useState, Suspense, useEffect } from 'react';
import createFetcher from './create-fetcher';
import PropTypes from 'prop-types';
import api from './api';
import history from './history';
import { produce } from 'immer';
import io from 'socket.io-client';
import { withRouter, useHistory, useParams } from 'react-router-dom';

var imgStyle = {
  float: 'left',
  border: '1px solid',
  width: '100px',
  height: '100px',
  objectFit: 'cover',
}

var menuItemStyle = {
  border: '2px solid',
  padding: '5px',
  margin: '5px',
}

var CartStatusStyle = {
  position: 'fixed',
  height: '50px',
  bottom: '5px',
  border: '2px solid',
  left: '5px',
  right: '5px',
  backgroundColor: 'pink',
}

//展示菜品信息
function MenuItem({ food, onUpdate, amount }) {
  // var [count, setCount] = useState(amount);//操作菜品数量
  //减少菜品数量
  function dec() {
    if (amount === 0) {
      return
    }
    // setCount(count - 1)
    onUpdate(food, amount - 1)
  }
  //添加菜品数量
  function inc() {
    // setCount(count + 1)
    onUpdate(food, amount + 1)
  }


  return (
    <div style={menuItemStyle}>
      <h3>{food.name}</h3>
      <div>
        <img style={imgStyle} src={'http://localhost:5000/upload/' + food.img} alt={food.name} />
        <p>{food.desc}</p>
        <p>{food.price}</p>
      </div>
      <div>
        <button onClick={dec}>-</button>
        <span>{amount}</span>
        <button onClick={inc}>+</button>
      </div>
    </div>
  )
}

MenuItem.prototype = {
  food: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
}

MenuItem.defaultProps = {
  onUpdate: () => { },
}

var menuFetcher = createFetcher(() => {
  return api.get('/menu/restaurant/1')
  // .then(res => {
  //     this.setState({
  //       foodMenu: res.data,
  //     })
  //   })
})





// /**
//  * foods：购物车信息
//  * onUpdate事件：用户修改菜品数量时触发
//  * onPlaceOrder事件：用户点击下单时触发
//  */
function CartStatus(props) {
  console.log(props.foods)
  var [expand, setExpand] = useState(false);//展开或收起
  var totalPrice = calcTotalPrice(props.foods);//总价
  return (
    <div style={CartStatusStyle}>
      {expand ?
        <button onClick={() => setExpand(false)}>展开</button> :
        <button onClick={() => setExpand(true)}>收起</button>

      }

      <strong>总价: {totalPrice}</strong>
      <button onClick={props.onPlaceOrder}>下单</button>
    </div>
  )
}


function calcTotalPrice(cartAry) {//计算订单总价格
  return cartAry.reduce((total, item) => {
    return total + item.amount * item.food.price;
  }, 0);
}






// export default () => {
//   return (
//     <Suspense fallback={<div>加载中...</div>}>
//       <FoodCart/>
//     </Suspense>
//   )
// }

export default class FoodCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //订单
      cart: [],
      //产品列表
      foodMenu: [],
      //桌面信息
      deskInfo: {},

    }
  }

  componentDidMount() {
    var params = this.props.match.params;
    //获取桌面信息
    api.get('/deskinfo?did=' + params.did).then(val => {
      this.setState({
        deskInfo: val.data
      })
    })
    //获取菜单
    api.get('/menu/restaurant/1').then(res => {
      this.setState({
        foodMenu: res.data,
      })
    })
    //连接localhost网络 
    this.socket = io('ws://localhost:5000/');

    this.socket.on('connect',() => {
      console.log('connect ok');
      
      //发送一个join desk 事件,即告诉后端,我的房间id
      this.socket.emit('join desk','desk:' + params.did);
    })

    //后端发回此桌面已点菜单
    this.socket.on('cart food',info => {
      console.log('cart food',info);
      this.setState(produce(state => {
        state.cart.push(...info);
      }))
    })
    //来自同桌其他用户新增的菜单
    this.socket.on('new food', info => {
      // debugger;
      console.log(info);
      this.foodChang(info.food,info.amount);
    })
    //其他同桌顾客点击下单后,所有菜单页面实时跳转到下单成功页面
    this.socket.on('placeorder success',order => {
      api.get('/restaurant/order').then(res => {
        history.push(`/r/${params.rid}/d/${params.did}/o/${res.data.id}/order-success`);
      })
    })

  }

  componentWillUnmount() {
    this.socket.close();
  }

  cartChange = (food,amount) => {
    var params = this.props.match.params;
    //广播发送new food 事件
    this.socket.emit('new food', {desk: 'desk:' + params.did, food, amount });
  }

  //菜品添加到订单cart中
  foodChang = (food, amount) => {

    var updated = produce(this.state.cart, cart => {
      var idx = cart.findIndex(it => it.food.id === food.id);//判断该菜品id是否存在于订单中
      if (idx >= 0) {//如果订单中存在此菜品
        if (amount === 0) {//如果此菜品数量为0(顾客不点此菜)
          cart.splice(idx, 1);//就将其菜品从订单中删除
        } else {
          cart[idx].amount = amount;//否则就将其菜品数量更新
        }
      } else {//否则就将此菜品添加进订单
        cart.push({
          food,
          amount,
        })
      }
    })
    this.setState({ cart: updated });
  }

  //顾客下订单
  placeOrder = (cart) => {
    var params = this.props.match.params;
    console.log('下单');
    api.post(`/restaurant/${params.rid}/desk/${params.did}/order`, {
      deskName: this.state.deskInfo.name,
      customCount: params.count,
      totalPrice: calcTotalPrice(this.state.cart),
      foods: this.state.cart,
    }).then(res => {
      console.log(res.data);
      history.push(`/r/${params.rid}/d/${params.did}/o/${res.data.id}/order-success`)
    });
  }

  render() {
    // var foods = menuFetcher.read().data;//上架的菜品
    return (

      <div>
        <div>
          {
            this.state.foodMenu.map(food => {
              var currentAmount = 0
              var currFoodCartItem = this.state.cart.find(cartItem => cartItem.food.id == food.id);
              if(currFoodCartItem){
                currentAmount = currFoodCartItem.amount
              }
              return <MenuItem key={food.id} food={food} amount={currentAmount} onUpdate={this.cartChange} />
            })
          }
        </div>
        <div style={CartStatusStyle}>
          <CartStatus foods={this.state.cart} onUpdate={this.cartChange} onPlaceOrder={() => this.placeOrder(this.state.cart)} />
        </div>
      </div>
    )
  }

}



/**
function FoodCart(props){
  var params = useParams();
  var [deskInfo,setDeskInfo] = useState(null);//桌面信息
  var foods = menuFetcher.read().data;//上架的菜品
  var [cart,setCart] = useState([]);

  useEffect(() => {//获取桌面信息
    api.get('/deskinfo?did=' + params.did).then(val => {
       setDeskInfo(val.data);
    })
  },[])

  //菜品添加到订单cart中
  function foodChang(food,amount){
    var updated = produce(cart,cart => {
      var idx = cart.findIndex(it => it.food.id === food.id);//判断该菜品id是否存在于订单中
      if(idx >= 0){//如果订单中存在此菜品
        if(amount === 0){//如果此菜品数量为0(顾客不点此菜)
          cart.splice(idx,1);//就将其菜品从订单中删除
        }else{
          cart[idx].amount = amount;//否则就将其菜品数量更新
        }
      }else{//否则就将此菜品添加进订单
        cart.push({
          food,
          amount,
        })
      }
    })
    setCart(updated);
  }
  //顾客下订单
  function placeOrder(cart){
    console.log('下单');
    api.post(`/restaurant/${params.rid}/desk/${params.did}/order`,{
      deskName:deskInfo.name,
      customCount:params.count,
      totalPrice: calcTotalPrice(cart),
      foods:cart,
    }).then(res => {
      console.log(res.data);
      history.push(`/r/${params.rid}/d/${params.did}/o/${res.data.id}/order-success`)
    });
  }
  return (
    <div>
      <div>
        {
          foods.map(food => {
            return <MenuItem key={food.id} food={food} onUpdate={foodChang}/>
          })
        }
      </div>
      <div style={CartStatusStyle}>
        <CartStatus foods={cart} onUpdate={foodChang}  onPlaceOrder={() => placeOrder(cart)} />
      </div>
    </div>
  )
}

*/

