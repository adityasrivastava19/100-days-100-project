const { Command } = require('commander');
const program = new Command();
const fs=require('fs');

program
  .name('word')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program.command('word')
  .description('count the word inside the file ')
  .argument('<file>', 'count the words')
  .action((file) => {
   fs.readFile(file,"utf-8",function(err,data)
  {
    let total =0;
    for(let i=0;i<data.length;i++)
    {
      if(data[i]==" ")
      {
        total++;
      }
    }
    console.log(total+1);
  })
  });

  program.command('line')
  .description('count the line in the file ')
  .argument('<file>', 'count the line')
  .action((file) => {
   fs.readFile(file,"utf-8",function(err,data)
  {
    let total =0;
    for(let i=0;i<data.length;i++)
    {
      if(data[i]=="\n")
      {
        total++;
      }
    }
    console.log(total+1);
  })
  });
program.parse();
//used a library and depancy named cammander which usi use cretae the command line interface so we can create the it 
