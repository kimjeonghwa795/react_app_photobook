import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs'
import path from "path"

import api from './routes';

const app = express();

let port = 3000;

app.use(bodyParser.json());

// app.get("/*", function (req, res) {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// })

app.get("/photos/:filename", async (req,res) => {
    let filename = req.params.filename
    let filePath = path.join(__dirname,'../photos', filename);
    let stat = fs.statSync(filePath);
    let fileEx = filename.split(".")
    fileEx = fileEx[fileEx.length-1]
    res.writeHead(200, {
        'Content-Type': fileEx,
        'Content-Length': stat.size
    });
    let readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
})

app.use(express.static('../client/build/'));
app.use('/api', api);

app.listen(port, () => {
    console.log('Express is listening on port', port);
});