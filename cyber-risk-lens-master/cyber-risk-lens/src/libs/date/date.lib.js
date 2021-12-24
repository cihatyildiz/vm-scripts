

function date(variable) {
     const options = {
       year: "numeric",
       month: "long",
       day: "numeric",
     };
    const newDate = new Date(variable).toLocaleDateString("en-US", options);
    const newTime = new Date(variable).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
   const dateString = newDate +" "+newTime
    return dateString
}

export default date
