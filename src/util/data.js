function isEmpty(obj) {
  if(!obj) return true;
  if(typeof(obj) == 'object'){
   for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false;
   }
   return true;
  } else if (typeof obj == 'string'){
    return obj == ""
  }
 }

module.exports = {
  isEmpty: isEmpty
}
