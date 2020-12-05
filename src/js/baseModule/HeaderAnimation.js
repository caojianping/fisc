export default {
    timerHeader() {
        let self = this;
        if (!self.isSwitchHeader) {
            setTimeout(() => {
                self.isSwitchHeader = true;
                self.isShowHeader = false;
            }, 3000);
        }
    },
    toggleHeader(event) {
        let self = this;
        if (self.isSwitchHeader) {
            if (event.clientY < 62 && !self.isShowHeader) {
                self.isShowHeader = true;
            } else if (event.clientY >= 62 && self.isShowHeader) {
                self.isShowHeader = false;
            }
        }
    }
};