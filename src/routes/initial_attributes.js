const express = require('express');
const initial_attributes = express.Router();
import { testEnvironmentVariable } from '../settings';

const {mysqlConnection} = require('../database');


// PARA ESTE MICROSERVICIO SE NECESITA INGRESAR LOS DATOS DE LA SIGUIENTE MANERA:
/* Ejemplo de Json del Body para el POST
    {
    "id_player": 2,
    "nameat": "Resistencia",
    "namecategory": "Físico",
    "data": 1,
    "data_type": "in.off",
    "input_source": "xlr8_podometer",
    "date_time": "2019-05-16 13:17:17"
    }
*/

initial_attributes.get("/", (req,res) =>{
    res.status(200).json({ message: testEnvironmentVariable})


});

/*
POST: Crea las tablas iniciales intermedias para poder poner los niveles de las dimensiones
*/
initial_attributes.post('/player_all_attributes/:id_player', (req,res,next)=>{
   
    var id_player = req.params.id_player
    var id_attributes = [1,2,3,4,5]
    console.log(req.params)
    console.log(req.body)
    console.log(id_player)
    console.log(id_attributes)

    if(!id_player || !id_attributes){
        return res.sendStatus(400)
    }
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var insertInto = 'INSERT INTO `playerss_attributes`  '
    var columns = '(`id_playerss`,`id_attributes`,`data`,`last_modified`) '
    var values = 'VALUES (?,?,?,'+ '\''+date +'\''+')'
    var query = insertInto+columns+values

    console.log('Este es el query original')
    console.log(query)
    mysqlConnection.getConnection(function(err,connection){
        if (err) {
          callback(false);
          return;
        }
        for(let i = 0; i< id_attributes.length; i++){
            connection.query(query,[id_player,id_attributes[i],0], function(err,rows,fields){
                if(!err) {
                }
            });
            connection.on('error', function(err) {
                res.status(400).json('Insert error', {id_player: id_player,attributes: id_attributes[i]})    
                return
            });


        }
        connection.release();

        
        console.log('Antes del succes');
        res.status(200).json('Success');
       
    });   
        
});

initial_attributes.post('/adquired_subattribute/', (req,res,next)=>{
    var adquired_subattribute = req.body;
    var id_player = adquired_subattribute.id_player
    var id_subattributes_conversion_sensor_endpoint = adquired_subattribute.id_subattributes_conversion_sensor_endpoint
    var new_data = adquired_subattribute.new_data

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
                res.status(400).json('adquired_subattribute error', {data: new_data[i],attributes: id_attributes[i]})          
                connection.release();
                return;
            });


        }
        connection.release();

        
        console.log('Antes del succes');
        res.status(200).json('Success');
       
    });   
        
});
/*
Input: 
  const expended_attribute_final = {
        "id_player":spend_attributes.id_player,
        "id_videogame": spend_attributes.id_videogame,
        "id_modifiable_conversion_attribute":modifiable_conversion_attribute_relation,
        "new_data":spend_attributes.new_data
    }
data = [20,10]
Description: Simple MYSQL query
*/

initial_attributes.post('/spent_attribute/', (req,res,next)=>{
    var spent_attribute = req.body;
    var id_player = spent_attribute.id_player
    var id_videogame = spent_attribute.id_videogame

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
                return
            });


        }
        connection.release();

        
        console.log('Antes del succes');
        res.status(200).json('Success');
       
    });   
        
});
/*
Input: 
var dataChanges ={  
        "id_player":  1
        "id_attributes": [3,4] //Ej: id_attributes = , distintos
        "new_data": [20,34]
    }
data = [20,10]
Description: Simple MYSQL query
*/

initial_attributes.put('/player_attributes',(req,res)=>{
    console.log(req.body)
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
        if (err) {
          callback(false);
          return;
        }
        for(let i = 0; i< id_attributes.length; i++){
            connection.query(query,[new_data[i], id_player,id_attributes[i]],function(err,rows){
                if(!err) {
                }
            });
            connection.on('error', function(err) {
                res.status(400).json('player_attribute_error', {data: new_data[i],attributes: id_attributes[i]})   
                connection.release();
                return
            });


        }
        connection.release();

        
        console.log('Antes del succes');
        res.status(200).json('Success');
       
    });
})
/*
Input: 
var dataChanges ={  
        "id_player":  1
        "id_attributes": 3
        "new_data": 4
    }
data = [20,10]
Description: Simple MYSQL query
*/
initial_attributes.put('/player_attributes_single',(req,res)=>{
    console.log(req.body)
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
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[new_data, id_player,id_attributes], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
                
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })

    
})





/*
Input: Json of sensor data
Output: Void (Just stores the json in the database)
Description: Simple MYSQL query
*/
initial_attributes.post('/attributes/', (req,res,next)=>{
    console.log("asdasdasdasdasdsa");
    var post_data = req.body;
    console.log(post_data);
    console.log("asdasdasdasdasdsa");
    if(!req.body.id_player || !req.body.id_player|| !req.body.nameat|| !req.body.namecategory|| !req.body.data|| !req.body.data_type|| !req.body.input_source|| !req.body.date_time){
        return res.sendStatus(400).json({
            error: 'Missing data'
          })
    }
    console.log(post_data);
    var id_player = Number(post_data.id_player);
    var nameat = post_data.nameat;
    var namecategory = post_data.namecategory;
    var data = Number(post_data.data);
    var data_type = post_data.data_type;
    var input_source = post_data.input_source;
    var date_time = post_data.date_time;

    
    console.log('casienelquery');
    try {mysqlConnection.query('SELECT*FROM `attributes` where players_id_players=? AND name =?',[id_player,namecategory], function(err,rows,fields){
        console.log('CASI EN EL IF',!err);
        if(!err){
            
            var attributes_id_attributes = rows[0].id_attributes
            console.log('ENTRO EN EL IF')   ;
            console.log(attributes_id_attributes);
            mysqlConnection.query('INSERT INTO `subattributes` (`nameat`,`namecategory`,`data`,`data_type`,`input_source`,`date_time`,`attributes_id_attributes`)VALUES (?,?,?,?,?,?,?)',[nameat,namecategory,data,data_type,input_source,date_time,attributes_id_attributes], function(err2,rows2,fields2){
                if (!err2){
                    console.log('Antes del succes');
                    res.status(200).json('Success');
                } else {
                    console.log(err);
                    res.status(400).json('Error in add')
                }
            });
        } else {
            console.log(err);
            res.status(400).json('The player does not exist');
        }
        
    });
    } catch(ex) {
        callback(new Error('something bad happened'));
    }

})

export default initial_attributes;

