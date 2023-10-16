const form = document.getElementById('form');
const amount = document.getElementById('topUpAmount');

form.addEventListener('submit', e => {
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
    let flag = true;

    const amountValue = amount.value.trim();

    if (!amountValue.trim()) {
        setError(amount, 'Amount Cannot Be Empty');
        flag = false;
    }else if(amountValue===''){
        setError(amount,'Amount Cannot Be Empty')
        flag=false
    }else if(amountValue < 0){
        setError(amount,'Amount Cannot Be Negative')
        flag=false
    } else {
        setSuccess(amount);
    }

    if (flag) {
        form.submit();
    }
};
