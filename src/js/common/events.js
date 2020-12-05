export default {
    addEvent(element, type, handler, userCapture) {
        if (!element || !type || !handler) return;
        userCapture = !!userCapture;

        if (element.addEventListener) {
            element.addEventListener(type, handler, userCapture);
            return true;
        } else if (element.attachEvent) {
            return element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },
    removeEvent(element, type, handler, userCapture) {
        if (!element || !type || !handler) return;
        userCapture = !!userCapture;

        if (element.removeEventListener) {
            element.removeEventListener(type, handler, userCapture);
            return true;
        } else if (element.detachEvent) {
            return element.detachEvent('on' + type, handler);
        }
        else {
            element['on' + type] = null;
        }
    }
}