const darkViewDom = document.createElement('div');
darkViewDom.style.backgroundColor = 'black';
darkViewDom.style.position = 'fixed';
darkViewDom.style.top = '0';
darkViewDom.style.width = '100%';
darkViewDom.style.height = '100%';
darkViewDom.style.opacity = '0.4';
darkViewDom.style.zIndex = '99999';
darkViewDom.id = 'darkViewDom';

const darkViewBody = document.getElementsByTagName('body');
darkViewBody[0].appendChild(darkViewDom);
