
const { response } = require("express");
const express = require("express");
const real_time_attributes = express.Router();
const {mysqlConnection} = require('../database');

// put any other code that wants to use the io variable
// in here

real_time_attributes.put('/player_attributes_rt',(req,res)=>{
    console.log('paso por aqui')
    const io = req.app.locals.io

    let id_player = req.body.id_player;
    let id_attributes = req.body.id_attributes;
    let new_data = req.body.new_data

    let date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    let update = 'UPDATE `playerss_attributes` '
    let set = ' SET `data` = ?,`last_modified` = ' + '\''+date+'\'' 
    let where = ' WHERE `playerss_attributes`.`id_playerss` = ? '
    let and = 'AND `playerss_attributes`.`id_attributes` = ? '
    let query = update+set+where+and
    console.log(id_player)
    console.log(id_attributes)
    console.log(new_data)

    console.log(query)
    mysqlConnection.getConnection(function(err,connection){
        var complete_index = id_attributes.length
        if (err) {
            res.status(400).json({message:'No se pudo tener una coneccion, tratar nuevamente'});            
            callback(false);
            return;
        }
        for(let i = 0; i< id_attributes.length; i++){
            console.log(complete_index)
            connection.query(query,[new_data[i], id_player,id_attributes[i]],function(err,rows){
                if(!err) {
                    complete_index--
                }
            });
            connection.on('error', function(err) {
                res.status(400).json({message:'Error in updating attributes'});
                connection.release();
                res.end();
            });


        }
        var results = {id_attributes: [], data: []}
        for(let i = 0; i< id_attributes.length; i++){             
            results.id_attributes.push(id_attributes[i])
            results.data.push(new_data[i])
        }
        connection.release();
        console.log('printing')
        console.log(results)
        io.of("/dimensions").in(id_player.toString()).emit('player_attribute', results)
        res.status(200).json({message:'Success'});            

    });
})

real_time_attributes.post('/adquired_subattribute_rt', (req,res,next)=>{
    var adquired_subattribute = req.body;
    var id_player = adquired_subattribute.id_player
    var id_sensor_endpoint = adquired_subattribute.id_sensor_endpoint
    var id_subattributes = adquired_subattribute.id_subattributes
    var id_subattributes_conversion_sensor_endpoint = adquired_subattribute.id_subattributes_conversion_sensor_endpoint
    var new_data = adquired_subattribute.new_data
    const io = req.app.locals.io

    console.log('Estos son los attributes:')
    console.log(adquired_subattribute)
    if(!id_player || !id_subattributes_conversion_sensor_endpoint|| !new_data){
        return res.sendStatus(400)
    }
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var insertInto = 'INSERT INTO `adquired_subattribute` (`id_players`,`id_subattributes_conversion_sensor_endpoint`,`data`,`created_time`) VALUES'
    var values = '(?,?,?,'+ '\''+date +'\''+')'
    var query = insertInto+values

    console.log('Este es el query original')
    console.log(query)
    mysqlConnection.getConnection(function(err,connection){
        if (err) {
          callback(false);
          return;
        }
        for(let i = 0; i< id_subattributes_conversion_sensor_endpoint.length; i++){
            connection.query(query,[id_player,id_subattributes_conversion_sensor_endpoint[i], new_data[i]], function(err,rows,fields){
                if(!err) {
                }
            });
            connection.on('error', function(err) {
                res.status(400).json('adquired_subattribute error', {id_player: id_player, data: new_data[i],id_subattributes_conversion_sensor_endpoint: id_subattributes_conversion_sensor_endpoint[i]})          
                connection.release();
                res.end();
            });


        }     
        
        var results = []
        for(let i = 0; i< id_subattributes.length; i++){          
            results.push({id_subattributes:id_subattributes[i], data:new_data[i], id_sensor_endpoint:id_sensor_endpoint, created_time:date})
        }
        connection.release();
        console.log('printing')
        console.log(results)

        io.of("/dimensions").in(id_player.toString()).emit('player_adquired_subattribute', results)
        console.log('Antes del succes');
        res.status(200).json('Success');
       
    });   
        
});

real_time_attributes.post('/spent_attribute_rt', (req,res,next)=>{
    const io = req.app.locals.io

    var spent_attribute = req.body;
    var id_player = spent_attribute.id_player
    var id_videogame = spent_attribute.id_videogame
    var id_modifiable_mechanic = spent_attribute.id_modifiable_mechanic
    var id_attributes = spent_attribute.id_attributes
    var id_modifiable_conversion_attribute = spent_attribute.id_modifiable_conversion_attribute
    var new_data = spent_attribute.new_data

    console.log('Estos son los attributes:')
    console.log(spent_attribute)
    if(!id_player || !id_videogame|| !new_data || !id_modifiable_conversion_attribute){
        return res.sendStatus(400)
    }
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var insertInto = 'INSERT INTO `expended_attribute` (`id_players`,`id_videogame`,`id_modifiable_conversion_attribute`,`data`,`created_time`) VALUES'
    var values = '(?,?,?,?,'+ '\''+date +'\''+')'
    var query = insertInto+values

    console.log('Este es el query original')
    console.log(query)
    mysqlConnection.getConnection(function(err,connection){
        if (err) {
          callback(false);
          return;
        }
        for(let i = 0; i< id_modifiable_conversion_attribute.length; i++){
            connection.query(query,[id_player,id_videogame,id_modifiable_conversion_attribute[i],new_data[i]], function(err,rows,fields){
                if(!err) {
                }
            });
            connection.on('error', function(err) {
                res.status(400).json('spent_attribute error', {data: new_data[i],attributes: id_attributes[i]})    
                connection.release();
                res.end();
            });


        }
        var results = []
        for(let i = 0; i< id_attributes.length; i++){          
            results.push({id_attributes:id_attributes[i], data:new_data[i], id_videogame:id_videogame, id_modifiable_mechanic:id_modifiable_mechanic, created_time:date})
        }
        connection.release();
        console.log('printing')
        console.log(results)

        io.of("/dimensions").in(id_player.toString()).emit('player_expended_attribute', results)
        console.log('Antes del succes');
        res.status(200).json('Success');

    });   
        
});


export default real_time_attributes;

