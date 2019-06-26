import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    themes: {
      light: {
        dpGreen: "#82BC00",
        dpOrange: "#F89728",
        dpBlack: "#333",
        googleBlue600: "#1A73E8"
      },
      dark: {
        dpGreen: "#82BC00",
        dpOrange: "#F89728",
        dpBlack: "#333",
        googleBlue600: "#1A73E8"
      }
    }
  }
})
