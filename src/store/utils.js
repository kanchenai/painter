/**
 * size使用标签的控件名
 * @type {string[]}
 */
let sizeComponent = ["button"];

let getDataById = function (painterData, id) {
    let data = null;
    if (painterData.id == id) {
        data = painterData;
    } else {
        let children = painterData.children;
        if (children) {
            for (let child of children) {
                data = getDataById(child, id);
                if (data) {
                    break;
                }
            }
        }
    }

    return data;
}

let buildTree = function (painterData) {
    let data = [];

    let children = painterData.children;
    if (children) {
        children.forEach((child, index) => {
            data.push(buildChildTree(child, index + 1));
        })
    }

    return data;
}

let buildChildTree = function (child, id) {
    let data = {
        id: child.id,
        label: "",
        type: child.type,
        children: []
    }

    data.label = (child.type ? child.type : "div");

    if (child.props && child.props.value) {
        data.label = child.props.value;
    }

    if(child.type == "group"){
        let grandchildren = child.children;
        if (grandchildren) {
            grandchildren.forEach((grandchild, index) => {
                let childData = buildChildTree(grandchild, id + "-" + (index + 1));

                data.children.push(childData);
            })
        }
    }



    return data;
}

let buildPage = function (painterData) {
    let tagName = "div";
    if (painterData.type == "img" || painterData.type == "IMG") {
        tagName = "img";
    }
    let ele = document.createElement(tagName);

    // if (painterData.id) {
    //     ele.setAttribute("view-id", painterData.id);
    // }

    let viewType = "";
    if (painterData.type && (painterData.type != "div" && painterData.type != "DIV") && (painterData.type != "img" && painterData.type != "IMG")) {
        viewType = painterData.type;
    }
    if (viewType) {
        ele.setAttribute("view-type", viewType);
    }

    if (painterData.props) {
        let props = {...painterData.props}
        let keys = Object.keys(props);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = props[key];
            if (value) {
                if (key == "src") {
                    ele.src = value;
                } else if (viewType == "text" || viewType == "view-text" || !viewType) {
                    if (key == "value") {
                        ele.innerText = value;
                    }
                } else {
                    ele.setAttribute(key, value);
                }
            }
        }
    }

    if (painterData.style) {
        let style = {...painterData.style};
        if (sizeComponent.indexOf(viewType) >= 0) {
            let width = 0;
            let height = 0;
            if (style.width) {
                width = parseInt(style.width);
                delete style.width;
            }

            if (style.height) {
                height = parseInt(style.height);
                delete style.height;
            }

            ele.setAttribute("size", width + "," + height);
        }

        let styleKeys = Object.keys(style);
        for (let i = 0; i < styleKeys.length; i++) {
            let key = styleKeys[i];
            let value = style[key];
            if (value) {
                ele.style[key] = value;
            }
        }
    }

    if (painterData.children && painterData.children.length > 0) {
        for (let i = 0; i < painterData.children.length; i++) {
            let child = painterData.children[i];
            let childEle = buildPage(child);
            ele.appendChild(childEle);
        }
    }

    return ele;

}

let writeFile = function (name, content, fileType) {
    const stringData = content;
    // dada 表示要转换的字符串数据，type 表示要转换的数据格式
    const blob = new Blob([stringData], {
        type: "text/plain;charset=utf-8"
    })
    // 根据 blob生成 url链接
    const objectURL = URL.createObjectURL(blob)

    // 创建一个 a 标签Tag
    const aTag = document.createElement('a')
    // 设置文件的下载地址
    aTag.href = objectURL
    // 设置保存后的文件名称
    aTag.download = name + "." + fileType
    // 给 a 标签添加点击事件
    aTag.click()
    // 释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。
    // 当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
    URL.revokeObjectURL(objectURL)
}

export default {
    getDataById,
    buildTree,
    buildPage,
    writeFile
}