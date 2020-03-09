function TheLogin() {

    var password = 'potato_warehouse';

    if (this.document.login.pass.value == password) {
        top.location.href = "rcahp.html";
    } else {
        window.alert("Incorrect password, please try again.");
    }
}
