const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3010;

// middleware
app.use(cors());
app.use(express.json())



const uri = "mongodb+srv://jajahidd_db_user:j123@cluster0.yim1msq.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('Smart server is running')
})

async function run() {
    try {
        await client.connect();

        const db = client.db('bookStore');

        const usersCollection = db.collection('users');

        const bookCollection = db.collection('books');

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser)
            const email = req.body.email;
            const query = { email: email }
            const existingUser = await usersCollection.findOne(query);
            
            if (existingUser) {
                res.send({message: 'user already exits. do not need to insert again'})
            }
            else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result);
            }
        })
        app.get("/users", async (req, res)=>{
            // const reqUser = req.body
            const reqUser = req.query
            if (!reqUser.email){
                res.status(404).send({ message: "eUser not found" });
            }
            if (!reqUser.pass){
                res.status(404).send({ message: "pUser not found" });
            }
            console.log(reqUser)
            const checkUser = await usersCollection.findOne({email : reqUser.email});
            console.log(checkUser)
  
            if (checkUser) {
                
                if (reqUser.pass == checkUser.password){
                    res.send(checkUser);

                } else{res.status(404).send("something wrong");}
                
                
            } else {
                res.status(404).send({ message: "aUser not found" });
            }
                    })



            app.get('/user', async (req, res)=>{
                const userInfo = await usersCollection.find({}).toArray()
                res.send(userInfo)
            })


            app.post('/book', async (req, res) => {
            const newData = req.body;
            console.log(newData)
            const query = {
                title: newData,
                shortDescription: "",
                fullDescription: "",
                price: "",
                image: "",
            }
            // const result = await bookCollection.insertOne(newData);
            res.send(query);

        })

        app.get('/books', async (req, res)=>{
                const userInfo = await bookCollection.find({}).toArray()
                res.send(userInfo)
            })

        app.get('/book/:book_id', async (req, res)=>{
                const booksId = req.params.book_id
                console.log(booksId)
                const query = {_id : new ObjectId(booksId)}
                console.log(query)
                
                const result = await bookCollection.findOne(query)
                res.send(result)
            })


        app.delete('/book/:id', async (req, res)=>{
            const deleteData = req.params.id
            // console.log(deleteData)
            const query = {_id : new ObjectId(deleteData)}
            // console.log(query)
            const deleteInfo = await bookCollection.deleteOne(query)
                res.send(deleteInfo)
            })

            app.patch('/book_edit',async (req, res)=>{
                const data = req.body
                console.log(data)
                const query = {_id : new ObjectId(data._id)}
                const update = {
                    $set:{
                            
                            title:data.title,
                            shortDescription:data.shortDescription,
                            fullDescription:data.fullDescription,
                            price:data.price,
                            image:data.image,
                            }
                }
                const result = await bookCollection.updateOne(query,update)
                console.log(update)

                res.send(result)
            })



        




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally {

    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log(`Smart server is running on port: ${port}`)
})