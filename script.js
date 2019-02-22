require('dotenv').config();
const env = process.env
var AWS = require('aws-sdk');

var s3 = new AWS.S3();

fs = require('fs');


function initS3(){
  AWS.config.update({
    apiVersions: {
      s3: env.AWS_API_VERSION
    },
    region: env.AWS_REGION, 
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY, 
      secretAccessKey: env.AWS_SECRET_KEY, 
    }
  });
}

function putFile(file_path, file_name){
      fs.readFile(file_path, function (err, data) {
        if (err) { throw err; }

        var base64data = new Buffer(data, 'binary');

        s3.putObject({
          Bucket: env.AWS_BUCKET_NAME,
          Key: env.AWS_BUCKET_PATH + file_name,
          Body: base64data
        },function (resp) {
          console.log(arguments);
          console.log('Successfully uploaded package.');
        });

      });     
}

function lists3Files(){
    var bucketParams = {
       Bucket : env.AWS_BUCKET_NAME
    };  

    s3.listObjects(bucketParams, function(err, data) {
     if (err) {
        // console.log("Error", err);
     } else {
        console.log("Success", data);
     }
  }); 
}

function putBulkFile(list){
  list.forEach(function(file){
    putFile(file.path, file.name)
    // console.log( file.name)
  })
}

function listFiles(dir, filelist) {
  var fs = fs || require('fs'),
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = listFiles(dir + file + '/', filelist);
    }
    else {
      // console.log(dir.split('/'))
      filelist.push({"path": dir+file, "name": file});
    }
  });
  return filelist;
};


initS3();
// var list = listFiles('./fotos_hoteles/');
// putBulkFile(list);
lists3Files()