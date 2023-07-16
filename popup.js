

document.getElementById("grayViewSwitchCheck").addEventListener("click", function (e){
    const grayViewDom2 = document.getElementById('grayViewDom');

    if (grayViewDom2.style.opacity === '0.4') {
        grayViewDom2.style.opacity = '0';
    } else {
        grayViewDom2.style.opacity = '0.4';
    }
});


