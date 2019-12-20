const express = require('express');
const multer = require('multer');
const path = require('path');
const io = require('./io-server');
var fs = require('fs');
const sharp = require('sharp');

var deskCartMap = new Map();
//监听connection事件
io.restaurant.on('connection', socket => {
    console.log('restaurant client in');
    var restaurant = socket.handshake.query.restaurant;
    socket.join(restaurant)
})


ioServer.on('connection', socket => {
    console.log('someone on');;

    socket.on('join restaurant', restaurant => {
        socket.join(restaurant);
    })

    socket.on('join desk', desk => {
        console.log('join desk', desk);
        socket.join(desk);
        var cartFood = deskCartMap.get(desk);
        if (!cartFood) {
            deskCartMap.set(desk, []);
        }
        socket.emit('cart food', cartFood || []);
    })
    socket.on('new food', info => {
        var foodAry = deskCartMap.get(info.desk);
        var idx = foodAry.findIndex(it => it.food.id === info.food.id);
        if (idx >= 0) {//如果订单中存在此菜品
            if (info.amount === 0) {//如果此菜品数量为0(顾客不点此菜)
                foodAry.splice(idx, 1);//就将其菜品从订单中删除
            } else {
                foodAry[idx].amount = info.amount;//否则就将其菜品数量更新
            }
        } else {//否则就将此菜品添加进订单
            foodAry.push({
                food:info.food,
                amount:info.amount,
            })
        }
        console.log(foodAry);
        
        ioServer.in(info.desk).emit('new food', info);
    })

})




var storage = multer.diskStorage({
    destination: function (rea, file, cb) {
        cb(null, './upload/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const uploader = multer({ storage: storage })
let db
(async function () {
    db = await require('./db');
}())

const app = express.Router();

// 获取桌面信息如餐厅名称，桌面名称
// 将会在landing页面请求并展示
// /desinfo?rid=5&did=8
app.get('/deskinfo', async (req, res, next) => {
    // req.query.rid -> '5'
    // req.query.did -> '8'

    // CREATE TABLE desks (
    //   id integer primary key,
    //   rid integer not null,
    //   name string not null,
    //   capacity integer
    // );
    console.log(req.query.did)

    var desk = await db.get(`
    SELECT 
      desks.id as did,
      users.id as uid,
      desks.name,
      users.title
    FROM desks JOIN users ON desks.rid = users.id
    WHERE desks.id=?
  `, req.query.did)

    res.json(desk)
})


//返回某餐厅的菜单
// /menu/restaurant/25
app.get('/menu/restaurant/:rid', async (req, res, next) => {
    // CREATE TABLE foods (
    //   id integer primary key,
    //   rid integer not null,
    //   name string not null,
    //   desc string,
    //   price integer not null,
    //   img string,
    //   category string,
    //   status string not null
    // );

    var menu = await db.all(`
    SELECT * FROM foods WHERE rid = ? AND status = 'on'
  `, req.cookies.userid)

    res.json(menu)
})

// 用户下单
/**
 * {
 *  deskName:
 *  customCount:
 *  totalPrice:价格
 *  foocs:[{id,amount},{},{}]
 * }
 */
//添加订单
app.post('/restaurant/:rid/desk/:did/order', async (req, res, next) => {
    var rid = req.params.rid;
    var did = req.params.did;
    var deskName = req.body.deskName;
    var totalPrice = req.body.totalPrice;
    var customCount = req.body.customCount;
    var details = JSON.stringify(req.body.foods);
    var status = 'pending';//状态,其他状态:confirmed(确认账单),completed(付完款)
    var timestamp = new Date().toISOString();

    await db.run(`
        INSERT INTO orders (rid,did,deskName,totalPrice,customCount,details,status,timestamp)
            VALUES(?,?,?,?,?,?,?,?)
    `, rid, did, deskName, totalPrice, customCount, details, status, timestamp)
    //
    var order = await db.get('SELECT * FROM orders ORDER BY id DESC LIMIT 1');
    order.details = JSON.parse(order.details);//解析json
    res.json(order);

    var desk = 'desk:' + did
    deskCartMap.set(desk, []);
    ioServer.in(desk).emit('placeorder success', order);
    // io.restaurant.in('restaurant' + rid).emit('new order', order);
    //发送一个new order事件,参数为order(新添加的的订单);
    ioServer.emit('new order', order);

})




//订单管理
app.route('/restaurant/:rid/order')
    .get(async (req, res, next) => {
        //查询该餐厅的全部订单
        var orders = await db.all('SELECT * FROM orders WHERE rid = ? ORDER BY timestamp DESC', req.cookies.userid);
        orders.forEach(order => {//将所有的订单的details解析
            order.details = JSON.parse(order.details);
        })
        res.json(orders);
    })

app.route('/restaurant/:rid/order/:oid')
    .delete(async (req, res, next) => {
        // 删除订单
        var order = await db.run('SELECT * FROM orders WHERE rid = ? AND id =?', req.cookies.userid, req.params.oid)
        if (order) {
            await db.all('DELETE FROM orders WHERE rid = ? AND id = ?', req.cookies.userid, req.params.oid);
            delete order.id;
            res.json(order);
        } else {
            res.status(401).json({
                code: -1,
                msg: '没有此订单或您无权限操作此订单'
            })
        }
    })

//单个订单
app.route('/restaurant/:id/oorder')
    .get(async (req, res, next) => {
        //根据id查询单个订单的信息
        var order = await db.get('SELECT * FROM orders WHERE id = ?', req.params.id);
        order.details = JSON.parse(order.details);
        res.json(order);
    })

//删除订单
app.route('/restaurant/:rid/order/:ord')
    .delete(async (req, res, next) => {
        await db.run('DELETE FROM orders WHERE id = ?', req.params.oid, req.cookies.userid);

    })
//更改订单状态
app.route('/restaurant/:rid/order/:oid/status')
    .put(async (req, res, next) => {
        console.log(req.body.status);
        
        await db.run(`
                    UPDATE orders SET status = ?
                        WHERE id = ? AND rid = ?`,
            req.body.status, req.params.oid, req.cookies.userid);
        let order =  await db.get(`SELECT * FROM orders WHERE id = ?`, req.params.oid)   
        console.log(order);
        
        res.json(order);
    })
//查询最新订单(单个)
app.route('/restaurant/order')
    .get(async (req,res,next) => {
        var order = await db.get('SELECT * from orders where id = (SELECT max(id) FROM orders)')
        order.details = JSON.parse(order.details);
        res.json(order);
    })





// 菜品管理api
app.route('/restaurant/:rid/food')
    .get(async (req, res, next) => {
        // 获取所有菜品列表用于在页面中展示

        // CREATE TABLE foods (
        //   id integer primary key,
        //   rid integer not null,
        //   name string not null,
        //   desc string,
        //   price integer not null,
        //   img string,
        //   category string,
        //   status string not null
        // );

        var foodList = await db.all('SELECT * FROM foods WHERE rid=?', req.params.rid)
        res.json(foodList)
    })
    //<imput type="file" name="img"/>
    .post(uploader.single('img'), async (req, res, next) => {
        // 增加一个菜品
        var tryLoginInfo = req.body
        console.log(tryLoginInfo,'000000')
        console.log(req.file,'图');
        let img = 'noPhoto.jpg';
        if(req.file){
            console.log('上传图片');
            const image = req.file.filename;
            await sharp(path.resolve(req.file.destination,image))
            .resize(300,300)
            .toFile(path.resolve(req.file.destination,`resized${image}`))
            .catch(console.log)
            fs.unlinkSync(path.resolve(req.file.destination,image));
            img = `resized${image}`;
        }
        console.log(img);
        var status = 'on';

        await db.run(`
            INSERT INTO foods (rid, name, price, status, desc, category, img) 
            VALUES (?,?,?,?,?,?,?)
            `,
            req.cookies.userid,
            req.body.name,
            req.body.price,
            status,
            req.body.desc,
            req.body.category,
            img)
        //添加完成后,查出刚添加的菜品
        var food = await db.get('SELECT * FROM foods ORDER BY id DESC LIMIT 1')
        //转为json后返回
        res.json(food)
    })

app.route('/restaurant/:rid/food/:fid')
    //删除一个菜品
    .delete(async (req, res, next) => {
        var fid = req.params.fid;
        var userid = req.cookies.userid;
        //先查询有无该菜品
        var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid);
        if (food) {//如果有则删除
            await db.run('DELETE FROM foods WHERE id = ? AND rid = ?', fid, userid);
            delete food.id
            res.json(food);
        } else {
            res.status(401).json({
                code: -1,
                msg: '不存在此菜品或您没有权限删除此菜品'
            })
        }
    })
    //修改菜品信息
    .put(uploader.single('img'), async (req, res, next) => {
        var fid = req.params.fid;
        var userid = req.cookies.userid;
        var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid);
        console.log(req.file);
        console.log(food,'food');
        let img = 'noPhoto.jpg';
        if(req.file){
            console.log('上传图片');
            const image = req.file.filename;
            await sharp(path.resolve(req.file.destination,image))
            .resize(300,300)
            .toFile(path.resolve(req.file.destination,`resized${image}`))
            .catch(console.log)
            fs.unlinkSync(path.resolve(req.file.destination,image));
            img = `resized${image}`;
        }
        console.log(img);
        
        var newFoodInfo = {
            name: req.body.name !== 'undefined' ? req.body.name : food.name,
            price: req.body.price !== 'undefined'? req.body.price : food.price,
            status: food.status,
            desc: req.body.desc !== 'undefined'? req.body.desc : food.desc,
            category: req.body.category !== 'undefined'? req.body.category : food.category,
            img: img !== 'undefined'? img : food.img,
        };  
        console.log(newFoodInfo,'    121');
        

        if (food) {//如果有则对其修改
            await db.run(
                `
                    UPDATE foods SET name = ?,price = ?, status = ?, desc = ?,category = ?,img = ?
                     WHERE id = ? AND rid = ?
                `,
                newFoodInfo.name, newFoodInfo.price, newFoodInfo.status, newFoodInfo.desc, newFoodInfo.category, newFoodInfo.img,
                fid, userid);
            //修改后的菜品
            var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid);
            //将新菜品返回
            res.json(food);
        } else {
            res.json({
                code: -1,
                msg: '不存在此菜品或您没有权限修改此菜品'
            })
        }

    })
// 修改菜品上下架
app.route('/restaurant/:rid/foods/:fid')
    .put(async (req,res,next) => {
        var fid = req.params.fid;
        var userid = req.cookies.userid;
        var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid);
        if (food) {//如果有则对其修改
            await db.run(
                `
                    UPDATE foods SET status = ?
                     WHERE id = ? AND rid = ?
                `,
                req.body.status,
                fid, userid);
            //修改后的菜品
            var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid);
            //将新菜品返回
            res.json(food);
        } else {
            res.json({
                code: -1,
                msg: '不存在此菜品或您没有权限修改此菜品'
            })
        }
    })


//查询单个菜品
app.route('/restaurant/:rid/food/:fid')
    .get(async (req,res,next) => {
        var fid = req.params.fid;
        var userid = req.cookies.userid;
        var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid); 
        res.json(food);
    })

//桌面管理api
app.route('/restaurant/:rid/desk')
    .get(async (req, res, next) => {
        //获取所有桌面列表用于在页面中展示

        var deskList = await db.all('SELECT * FROM desks WHERE rid=?', req.cookies.userid);
        res.json(deskList);
    })
    .post(async (req, res, next) => {
        console.log(req.body,'00000');
        
        // 增加一个桌子
        await db.run(`
            INSERT INTO desks (rid, name, capacity) VALUES (?, ?, ?)
            `, req.cookies.userid, req.body.name, req.body.capacity)
        //添加完成后,查出刚添加的桌子
        var desk = await db.get('SELECT * FROM desks ORDER BY id DESC LIMIT 1')
        //转为json后返回
        res.json(desk)
    })

app.route('/restaurant/:rid/desk/:did')
    .delete(async (req, res, next) => {
        var did = req.params.did;
        var userid = req.cookies.userid;
        //删除一个桌面
        //先查询有无该桌面
        var desk = await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?', did, userid);
        if (desk) {//如果有则删除
            await db.run('DELETE FROM desks WHERE id = ? AND rid = ?', did, userid);
            delete desk.id
            res.json(desk);
        } else {
            res.status(401).json({
                code: -1,
                msg: '不存在此桌面或您没有权限删除此桌面'
            })
        }
    })
    .put(async (req, res, next) => {
        //修改桌面信息
        var did = req.params.did;
        var userid = req.cookies.userid;
        var desk = await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?', did, userid);
        if (desk) {//如果有则对其修改
            await db.run(
                `
                    UPDATE desks SET name = ?,capacity = ?
                     WHERE id = ? AND rid = ?
                `,
                req.body.name, req.body.capacity, did, userid);
            //修改后的桌面
            var desk = await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?', did, userid);
            //将新桌面返回
            res.json(desk);
        } else {
            res.status(401).json({
                code: -1,
                msg: '不存在此桌面或您没有权限修改此桌面'
            })
        }

    })


module.exports = app
