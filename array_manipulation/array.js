
const arr = ["a","b","c","d"]

let index_val;
let val;
document.getElementById("results").innerHTML = arr;
function delete_value() {
    index_val = document.getElementById("index").value;
    val = document.getElementById("value").value;
    if(Number(index_val) > arr.length || Number(index_val)< 0){
        alert("Index is out of bound");
    }
    else if (index_val === ''){
        alert("Index is Empty");
    }
    else {
        arr.splice(Number(index_val),1);
        document.getElementById("results").innerHTML = arr; 
    }
    document.getElementById("index").value = '';
    document.getElementById("value").value = '';
}

function get_value() {
    index_val = document.getElementById("index").value;
    val = document.getElementById("value").value;
    if(Number(index_val) > arr.length || Number(index_val)< 0){
        alert("Index is out of bound");
    } 
    else if (index_val === ''){
        alert("Index is Empty");
    }
    else {
        arr.splice(Number(index_val),0,val);
        document.getElementById("results").innerHTML = arr; 
    }
    document.getElementById("index").value = '';
    document.getElementById("value").value = '';
}