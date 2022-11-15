export const state = {
  loadingApp: false,
  countLoading: 0
};

export const getters = {
  loadingApp: state => {
    return state.loadingApp
  },
};

export const mutations = {
  setLoading(state, isLoading){
    state.loadingApp = isLoading;
  },
};

export default {
  namespaced: false,
  state,
  getters,
  mutations
}
