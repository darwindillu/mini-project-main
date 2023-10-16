const form= document.getElementById('loginform');
const email=document.getElementById('email');
const password=document.getElementById('password');

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
    const emailValue=email.value.trim();
    const passwordValue=password.value.trim();

    let flag = false;

    if(emailValue===''){
        setError(email,'email is required')
        flag = false;
    }  else{setSuccess(email);
        flag = true;
    }

    if(passwordValue===''){
        setError(password,'password is required')
        flag = false;
    }else{
        setSuccess(password);
        flag = true;
    }

    if (flag) {
        form.submit();
    }
}