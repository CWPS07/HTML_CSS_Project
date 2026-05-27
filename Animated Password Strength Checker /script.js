
const password = document.getElementById("password");
const fill = document.getElementById("strength-fill");
const text = document.getElementById("strength-text");
const toggle = document.getElementById("toggle");

const lengthRule = document.getElementById("length");
const uppercaseRule = document.getElementById("uppercase");
const numberRule = document.getElementById("number");
const specialRule = document.getElementById("special");

password.addEventListener("input", () => {
    const value = password.value;

    let strength = 0;

    if(value.length >= 8){
        strength++;
        lengthRule.classList.add("valid");
        lengthRule.innerHTML = "✅ Minimum 8 Characters";
    } else {
        lengthRule.classList.remove("valid");
        lengthRule.innerHTML = "❌ Minimum 8 Characters";
    }

    if(/[A-Z]/.test(value)){
        strength++;
        uppercaseRule.classList.add("valid");
        uppercaseRule.innerHTML = "✅ One Uppercase Letter";
    } else {
        uppercaseRule.classList.remove("valid");
        uppercaseRule.innerHTML = "❌ One Uppercase Letter";
    }

    if(/[0-9]/.test(value)){
        strength++;
        numberRule.classList.add("valid");
        numberRule.innerHTML = "✅ One Number";
    } else {
        numberRule.classList.remove("valid");
        numberRule.innerHTML = "❌ One Number";
    }

    if(/[@&#$]/.test(value)){
        strength++;
        specialRule.classList.add("valid");
        specialRule.innerHTML = "✅ One Special Character";
    } else {
        specialRule.classList.remove("valid");
        specialRule.innerHTML = "❌ One Special Character(@&#$)";
    }

    if(strength === 1){
        fill.style.width = "25%";
        fill.style.background = "red";
        text.innerHTML = "Weak Password";
    }
    else if(strength === 2){
        fill.style.width = "50%";
        fill.style.background = "orange";
        text.innerHTML = "Medium Password";
    }
    else if(strength === 3){
        fill.style.width = "75%";
        fill.style.background = "yellow";
        text.innerHTML = "Strong Password";
    }
    else if(strength === 4){
        fill.style.width = "100%";
        fill.style.background = "limegreen";
        text.innerHTML = "Very Strong Password";
    }
    else {
        fill.style.width = "0";
        text.innerHTML = "Type a password...";
    }
});


toggle.addEventListener("click", () => {
    if(password.type === "password"){
        password.type = "text";
        toggle.innerHTML = "🙈";
    } else {
        password.type = "password";
        toggle.innerHTML = "👁";
    }
});
