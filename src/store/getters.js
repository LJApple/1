const getters = {
    /* app */
    sidebar: state => state.app.sidebar,
    getSliderStateWidth: state => {
        return state.app.sidebar.sliderState === 'full' ? '240px' : '60px'
    },
    /* permission */
    routes: state => state.router.routes,

    token: state => state.token
}
export default getters