function TheLogin() {

    var password = 'potato_warehouse';

    if (this.document.login.pass.value == password) {
        top.location.href = "rcanbp.html";
    } else {
        window.alert("Incorrect password, please try again.");
    }
}
