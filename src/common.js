export default {
    push(route) {
        this.$router.push(route);
    },
    routeTo(route, name) {
        let goto = false;

        /* Routes must have a matching route and name defined in Toolbar.vue in order to be processed */
        for (let n of this.$router.options.routes) {
            if (n.path === route || n.name === name) {
                goto = true;
                break;
            }
        }

        if (goto) {
            this.$router.push(route);
        }
        else {
            this.log("The route '" + route + "' could not be found under '" + name + "' in router.ts!");
            this.snackbar( 'error','An error occurred! The specified page does not exist.', 2.5)
        }
    },
    log(message) {
        if (process.env.NODE_ENV === "development") {
            console.log(message);
        }
    },
    snackbar(type='normal', msg, duration=0) {
        let response = {
            alertType: type,
            alertMessage: msg,
            btnColor: '#ffffff',
            duration: duration
        };

        switch (type) {
            case 'success':
                response.color = '#4CAF50';
                break;
            case 'info':
                response.color = '#2196F3';
                break;
            case 'warning':
                response.color = '#FB8C00';
                break;
            case 'error':
                response.color = '#FF5252';
                break;
            default:
                response.color = '#323232';
                response.btnColor = 'primary';
        }

        this.$emit('openSnackbar', response);
    },
    alert(type="", msg, options={}) {
        let response = {
            alertType: type,
            alertMessage: msg,
            options: options
        };

        switch (type) {
            case 'success':
                response.color = '#4CAF50';
                break;
            case 'info':
                response.color = '#2196F3';
                break;
            case 'warning':
                response.color = '#FB8C00';
                break;
            case 'error':
                response.color = '#FF5252';
                break;
            default:
                response.color = '#323232';
                response.btnColor = 'primary';
        }

        this.$emit('openAlert', response);
    },
    getStoreId(storeName) {
        return storeName.substring(storeName.indexOf("of") + 3).toLowerCase().replace(/\s/g, '-');
    }
}
