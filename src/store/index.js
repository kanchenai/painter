import Vue from "vue";
import Vuex from "vuex"
import utils from "@/store/utils";

Vue.use(Vuex)

let option = {
    state: {
        // 在这里定义应用程序的状态
        viewTreeData: [],
        viewDetailObj: {},

        painterDataId: 0,
        selectDataIdList: [],
        copyDataIdList: [],
    },
    // 在这里定义 mutations 修改状态的方法
    mutations: {
        addPage(state, label) {
            let id = state.painterDataId + "";
            state.viewTreeData.push({
                id,
                label,
                children: []
            })

            state.viewDetailObj[id] = {
                type: "page",
                style: {
                    width: 1280,
                    height: 720,
                    background: "black"
                },
            }

            state.painterDataId++;
        },

        editPage(state, {id, label}) {
            let {aimFork} = this.getters.getDataById(id);

            aimFork.label = label;
        },

        addView(state, {fatherId, data, name}) {
            let id = state.painterDataId + "";
            let {fatherFork, aimFork} = this.getters.getDataById(fatherId);

            if (!aimFork.children) {
                aimFork.children = [];
            }

            aimFork.children.push({
                id,
                label: name,
                children: []
            })

            // Vue.set(state.viewDetailObj,id,data)

            state.viewDetailObj[id] = data;

            state.painterDataId++;

            state.viewTreeData.__ob__.dep.notify();
        },

        dragFork(state, {draggingId, dropId, dropType}) {
            // console.log("{draggingId, dropId, dropType}",{draggingId, dropId, dropType})

            let draggingObj = this.getters.getDataById(draggingId);
            let dropObj = this.getters.getDataById(dropId);

            let draggingChildren = null;
            if (draggingObj.fatherFork.children) {
                draggingChildren = draggingObj.fatherFork.children;
            } else {
                draggingChildren = draggingObj.fatherFork;
            }

            let draggingIndex = draggingChildren.indexOf(draggingObj.aimFork);
            // console.log("draggingIndex",draggingIndex)
            draggingChildren.splice(draggingIndex, 1);//先移除


            let dropChildren = null;
            if (dropObj.fatherFork.children) {
                dropChildren = dropObj.fatherFork.children;
            } else {
                dropChildren = dropObj.fatherFork;
            }

            let dropIndex = dropChildren.indexOf(dropObj.aimFork);
            // console.log("dropIndex",dropIndex,JSON.parse(JSON.stringify(dropObj)))
            switch (dropType) {
                case "before":
                    dropChildren.splice(dropIndex, 0, draggingObj.aimFork);
                    break;
                case "inner":
                    if (!dropObj.aimFork.children) {
                        dropObj.aimFork.children = [];
                    }
                    dropObj.aimFork.children.push(draggingObj.aimFork);
                    break;
                case "after":
                    dropChildren.splice(dropIndex + 1, 0, draggingObj.aimFork);
                    break;
            }

            state.viewTreeData.__ob__.dep.notify();
        },

        editView(state, {id, data, name}) {
            let {aimFork} = this.getters.getDataById(id);

            aimFork.label = name;

            state.viewDetailObj[id] = data;
            state.viewDetailObj.__ob__.dep.notify();
            // console.log(state.viewDetailObj[id])
        },

        deleteView(state, id) {
            let {fatherFork, aimFork} = this.getters.getDataById(id);

            let children = null;
            if (fatherFork.children) {
                children = fatherFork.children;
            } else {
                children = fatherFork;//边界Page
            }
            let index = children.indexOf(aimFork);

            children.splice(index, 1);

            delete state.viewDetailObj[id];

            state.viewTreeData.__ob__.dep.notify();
        },

        selectView(state, {id}) {
            state.selectDataIdList = [id];
            state.selectDataIdList.__ob__.dep.notify();
        },

        copyView(state) {
            state.copyDataIdList = [...state.selectDataIdList];
        },

        pasteView(state, info) {
            let copyDataIdList = [];
            let toDataIdList = [];
            if (!info) {
                copyDataIdList = state.copyDataIdList;
                toDataIdList = state.selectDataIdList;
            } else {
                copyDataIdList = info.copyDataIdList;
                toDataIdList = info.toDataIdList;
            }

            toDataIdList.forEach(toDataId => {
                copyDataIdList.filter(copyId => {
                    let detail = this.getters.getDetailById(copyId);
                    let {aimFork} = this.getters.getDataById(copyId);
                    detail = JSON.parse(JSON.stringify(detail));
                    this.commit("addView", {fatherId: toDataId, data: detail, name: aimFork.label});

                    //复制内部控件
                    if (aimFork.children && aimFork.children.length > 0) {
                        let obj = this.getters.getDataById(toDataId);
                        let childId = obj.aimFork.children[obj.aimFork.children.length - 1].id
                        // console.log(childId);
                        let idList = [];
                        aimFork.children.forEach(data => {
                            idList.push(data.id);
                        })
                        this.commit("pasteView", {copyDataIdList: idList, toDataIdList: [childId]});
                    }


                })
            })
        },

        addPreview(state, {fatherId, preview}) {
            console.log({fatherId, preview})

            let detail = {...preview};
            delete detail.children;
            delete detail.label;
            detail = JSON.parse(JSON.stringify(detail));
            this.commit("addView", {fatherId, data: detail, name: preview.label});

            //复制内部控件
            if (preview.children && preview.children.length > 0) {
                let obj = this.getters.getDataById(fatherId);
                let childId = obj.aimFork.children[obj.aimFork.children.length - 1].id
                // console.log(childId);
                preview.children.forEach(childPreview => {
                    this.commit("addPreview", {fatherId: childId, preview: childPreview});
                })

            }
        },
    },
    getters: {
        // 在这里定义 getters 获取状态的方法
        getDataById: (state) => (id) => {
            return utils.getDataById(state.viewTreeData, id);
        },

        getDetailById: (state) => (id) => {
            return state.viewDetailObj[id];
        },
        isSelected: (state) => (id) => {
            return state.selectDataIdList.indexOf(id) >= 0;
        },
        nameUsable: (state,getters) => (name, type) => {
            let flag = true;

            if(!name){
                flag = false;
            }else if (type == "page") {
                for (let pageData of state.viewTreeData) {
                    if (pageData.label.toUpperCase() == name.toUpperCase()) {
                        flag = false;
                        break;
                    }
                }
            } else if (type == "frame") {
                for (let id of Object.keys(state.viewDetailObj)) {
                    let detail = state.viewDetailObj[id];
                    if (detail.type == "frame") {
                        let {aimFork} = getters.getDataById(id);
                        if (aimFork.label.toUpperCase() == name.toUpperCase()) {
                            flag = false;
                            break;
                        }
                    }
                }
            } else {

            }

            return flag;
        },
    },
    actions: {
        // 在这里定义 actions 处理异步操作
    },
};

let store = new Vuex.Store(option);

export default store;