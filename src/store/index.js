import Vue from "vue";
import Vuex from "vuex"
import utils from "@/store/utils";

Vue.use(Vuex)

let option = {
    state: {
        // 在这里定义应用程序的状态
        painterData: {
            id: 0,
            type:"group",
            style: {
                width: 1280,
                height: 720,
            }
        },
        painterDataId: 0,
        selectDataIdList: [],
    },
    mutations: {
        // 在这里定义 mutations 修改状态的方法
        addPainterChild(state, {id, data}) {
            let fatherData = utils.getDataById(state.painterData, id);
            if (!fatherData.children) {
                Vue.set(fatherData, "children", []);
            }
            state.painterDataId++
            data.id = state.painterDataId;
            Vue.set(fatherData.children, fatherData.children.length, data);
            // fatherData.children.push(data);

            state.painterData.__ob__.dep.notify();
        },

        editPainterData(state, {id, data}) {
            let oldData = utils.getDataById(state.painterData, id);
            oldData.type = data.type;
            oldData.props = data.props;
            oldData.style = data.style;


            oldData.__ob__.dep.notify();
        },

        deletePainterData(state, {fatherId, id}) {
            let fatherData = utils.getDataById(state.painterData, fatherId);
            let data = utils.getDataById(state.painterData, id);

            let index = fatherData.children.indexOf(data);
            fatherData.children.splice(index, 1);

            state.painterData.__ob__.dep.notify();
        }
    },
    getters: {
        // 在这里定义 getters 获取状态的方法
        getDataById: (state) => (id) => {
            return utils.getDataById(state.painterData, id);
        },
        treeData(state) {
            console.log(state.painterData)
            return utils.buildTree(state.painterData);
        }
    },
    actions: {
        // 在这里定义 actions 处理异步操作
    },
};

let store = new Vuex.Store(option);

export default store;