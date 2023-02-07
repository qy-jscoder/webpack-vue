const data=require('./banner.json')
module.exports=function(content){
    const options=this.getOptions(data)
    const prefix=`
        /*
        * Author: ${options.author}
        */
    `
    console.log(options);
    return prefix+content
}