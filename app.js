const express =require ('express')
const app =express ();
const morgan =require ('morgan')
const bodyParser =require ('body-parser')
const mongoose =require ('mongoose')
const cloudinary = require('cloudinary').v2



app.use((req,res,next)=>{
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', '*');
if (req.method==="OPTIONS") {
    res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');   
    return res.status(200).json({});
}
next();
})

// routes 
const productRoutes= require ('./routes/product');
const userRoutes =require ('./routes/user')
// bodyParsing
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


// Database connection
mongoose.connect('mongodb+srv://amoorest:' + process.env.MONGO_ATLAS_Pw +'@restful-api.p510ehi.mongodb.net/?retryWrites=true&w=majority&appName=RESTful-API' +{
    useMongoClient:true   
   })


   cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });

// use route
app.use('/products', productRoutes)
app.use('/user',userRoutes)

// browser response
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: ' Server is live' });
  });
  
  

app.use((req,res,next)=>{
    const error= new Error('Route Not found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
          message: error.message  
        }
    });
   
});

module.exports=app;
