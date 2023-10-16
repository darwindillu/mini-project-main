const form= document.getElementById('form');
const password=document.getElementById('password');
const passwordconfirm=document.getElementById('passwordconfirm');


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


const validateInputs = () => {
    const passwordValue = password.value.trim();
    const passwordconfirmValue = passwordconfirm.value.trim();


    let flag = true; 

    if (passwordValue === '') {
        setError(password, 'Password is required');
        flag = false;
    } else if (passwordValue.includes(' ')) {
        setError(password, 'Password cannot contain spaces');
        flag = false;
    } else if (passwordValue.length < 6) {
        setError(password, 'Password must contain at least 6 characters');
        flag = false;
    }else if(!passwordValue.trim()){
        setError(password,'Password is required')
        flag=false
    } else {
        setSuccess(password);
    }

    if (passwordconfirmValue === '') {
        setError(passwordconfirm, 'Password is required');
        flag = false;
    } else if (passwordconfirmValue.includes(' ')) {
        setError(passwordconfirm, 'Password cannot contain spaces');
        flag = false;
    } else if (passwordconfirmValue.length < 6) {
        setError(passwordconfirm, 'Password must contain at least 6 characters');
        flag = false;
    }else if(!passwordconfirmValue.trim()){
        setError(passwordconfirm,'Password is required')
        flag=false
    } else {
        setSuccess(passwordconfirm);
    }

    if (flag) {
        form.submit();
    }
};
