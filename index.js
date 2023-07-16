const grayViewDom = document.createElement('div');
grayViewDom.style.backgroundColor = 'black';
grayViewDom.style.position = 'fixed';
grayViewDom.style.top = '0';
grayViewDom.style.width = '100%';
grayViewDom.style.height = '100%';
grayViewDom.style.opacity = '0.4';
grayViewDom.style.zIndex = '99999';
grayViewDom.style.pointerEvents = 'none';
grayViewDom.id = 'grayViewDom';

const darkViewBody = document.getElementsByTagName('body');
darkViewBody[0].appendChild(grayViewDom);
