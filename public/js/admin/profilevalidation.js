const form =document.getElementById('form')
const username=document.getElementById('username')
const mobile= document.getElementById('mobile')


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
   
    const usernameValue= username.value.trim()
    const mobileValue= mobile.value.trim()

    let flag=true

    if(usernameValue===''){
        setError(username,'Name is required')
        flag=false
    }else if(!usernameValue.trim()){
        setError(username,'Name is required')
        flag=false
    }else{
        setSuccess(username)
    }

    if(mobileValue ===''){
        setError(mobile,'Cannot be Empty')
        flag=false
    }else if(mobileValue.length<10){
        setError(mobile,'Should contain 10 digits')
        flag=false
    }else{
        setSuccess(mobile)
    }

    if(flag){
        form.submit()
    }
}