const express=require('express');
const app=express();
function sum(a,b)
{
  return a+b;
}
app.get('/',function(req,res)
{
  const a=req.query.a;
  const b=req.query.b;
  const result=sum(Number(a),Number(b));
  res.send("The sum is "+result);
})
app.listen(3000);