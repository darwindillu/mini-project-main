const form= document.getElementById('form2')
const username= document.getElementById('name')
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

    let flag=true;

    if (usernameValue == '') {
        setError(username, 'Username is required');
        flag = false;
    } else if (usernameValue.startsWith(' ') || usernameValue.endsWith(' ')) {
        setError(username, 'Username cannot start or end with spaces');
        flag = false;
    } else {
        setSuccess(username);
    }

    if (mobileValue == '') {
        setError(mobile, 'Mobile number is required');
        flag = false;
    } else if (mobileValue.length !== 10 || !/^\d+$/.test(mobileValue)) {
        setError(mobile, 'Enter a valid 10-digit mobile number');
        flag = false;
    } else {
        setSuccess(mobile);
    }

    if(flag){
        form.submit()
    }
}