
var express = require('express');
var router = express.Router();

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const database = path.join(__dirname,"database","base.db");


const { I18n } = require('i18n');
  const i18n = new I18n({
    locales: ['es', 'en'],
    directory: path.join(__dirname, '/language'),
    defaultLocale: 'es',
  });
let lang = "";
const base = new sqlite3.Database(database, err => {


 if (err)
  {
    return console.error(err.message);
  } 
  else{
    console.log("Se creo la Base de Datos");
  }

});

const tabla = "CREATE TABLE IF NOT EXISTS contactos(nombre VARCHAR(30), gmail VARCHAR(30), comentario TEXT, fecha DATETIME, hora VARCHAR(20), ip VARCHAR(50));";


base.run(tabla,err => {

  if (err)
   {
     return console.error(err.message);
   } 
   else{
     console.log("Se creo la Tabla");
   }
 
 });

router.post("/", (req, res) =>{

let datetime = new Date();
let _date = datetime.toLocaleString();
let _time = datetime.toLocaleString();
let date = '';
let time = '';
let ip = req.headers['x-forwarded-for'];

for(let d = 0; d <= 8; d++){

  if(_date[d] == '/'){
    date += '-';
    continue;
  }
  else if(_date[d] == ','){
      continue;
    }
    date += _date[d];
  }

for(let t = 9; t <= 23; t++){

  if(_time[t] == ' ' || _time[t] == '.' ){
   break;
  }  

  time += _time[t];
}

if (ip){
  let ip_List = ip.split(',');
  ip = ip_List[ip_List.length -1];
}
else
{
  console.log('No se encontro una IP');
}

  const consulta = "INSERT INTO contactos(nombre, gmail, comentario, fecha, hora, ip) VALUES (?,?,?,?,?,?);";
  const datos = [req.body.nombre, req.body.gmail, req.body.comentario, date, time, ip];


  
base.run(consulta,datos,err => {

  if (err)
   {
     return console.error(err.message);
   } 
   else{
    res.redirect("/"); 
    console.log("Se contacto con Exito");
   }
 
 });

});


router.get("/contactos", (req, res, next) => {

  const consulta = "SELECT * FROM contactos;";
  base.all(consulta, [], (err, rows) => {

    if (err)
     {
       return console.error(err.message);
     } 
     else{
      res.render("contactos.ejs", {info:rows});  
     }
  });
});

router.get('/es-en',(req,res,next)=>{
  
  if(lang){
    i18n.init(req, res)
    res.setLocale('en');
    res.render('index.ejs', {info:{},bandera:"/imagen/eeuu.png"});
    lang = false;
  }
  else if(!lang){
    i18n.init(req, res)
    res.setLocale('es');
    res.render('index.ejs', {info:{},bandera:"/imagen/es.png"});
    lang = true;
  }
});

router.get('/',(req,res,next)=>{
  i18n.init(req, res);
  lang = req.acceptsLanguages('es');
	res.render('index.ejs', {info:{}, bandera:"/imagen/es.png"});
});

module.exports = router;
