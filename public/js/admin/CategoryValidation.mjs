const form= document.getElementById('categoryform');
const catname=document.getElementById('categoryname');
const description=document.getElementById('description')


form.addEventListener('submit',e =>{
    e.preventDefault();
    validateInputs();
});

const setError= (element,message)=>{
    const inputControl=element.parentElement;
    const errorDisplay=inputControl.querySelector('.error');

    errorDisplay.innerText=message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');

    setTimeout(() => {
        errorDisplay.innerText = '';
        inputControl.classList.remove('error');
    }, 3000);
}

const setSuccess= element=>{
    const inputControl=element.parentElement;
    const errorDisplay=inputControl.querySelector('.error');

    errorDisplay.innerText='';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

const validateInputs=()=>{
    const catnameValue=catname.value.trim();
    const descriptionValue=description.value.trim();



    let flag = false;

  

    if(catnameValue===''){
        setError(catname,'Name is required')
        flag = false;
    }else if(catnameValue.startsWith(' ')){
        setError(catname,"Cannot starts with ")
        flag = false;
    }else if(!catnameValue.trim()){
         setError(catname,'Name is required')
         flag=false
    }else{
        setSuccess(catname);
        flag = true;
    }

    if(descriptionValue===''){
        setError(description,'Description is required')
        flag = false;
    }else{
        setSuccess(description);
        flag = true;
    }

    if (flag) {
        console.log(catname.value)
        form.submit();
    }
}