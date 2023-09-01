const aplicaServer = require("./Apps") 


async function main (){
    await aplicaServer.listen(aplicaServer.get('port'));
   console.log('Server on PORT: ', aplicaServer.get('port'));
  }
  main();