import JSZip from "jszip";
import fragment from "@/components/frame/Fragment.vue";

/**
 * size使用标签的控件名
 * @type {string[]}
 */
let sizeComponent = ["button"];

let getDataById = function (treeData, id) {
    let fatherFork = null;
    let aimFork = null;
    for (let forkData of treeData) {
        let obj = getForkById(treeData, forkData, id);
        if (obj.aimFork) {
            aimFork = obj.aimFork;
            fatherFork = obj.fatherFork;
        }
    }

    return {fatherFork, aimFork};
}

let getForkById = function (fatherFork, fork, id) {
    let aimFork = null;
    if (fork.id == id) {
        aimFork = fork;
    } else {
        if (fork.children && fork.children.length > 0) {
            for (let childFork of fork.children) {
                let obj = getForkById(fork, childFork, id);

                if (obj.aimFork) {
                    aimFork = obj.aimFork;
                    fatherFork = obj.fatherFork;
                    break;
                }
            }
        }
    }

    return {fatherFork, aimFork}
}


let buildLayout = function (pageName, forkData, viewDetailObj) {
    let id = forkData.id;
    let detail = viewDetailObj[id];
    let tagName = "div";
    if (detail.type == "img" || detail.type == "IMG") {
        tagName = "img";
    }
    let ele = document.createElement(tagName);
    let imageList = [];
    let viewType = "";
    if (detail.type && (detail.type != "div" && detail.type != "DIV") && (detail.type != "img" && detail.type != "IMG")) {
        viewType = detail.type;
    }
    if (viewType) {
        ele.setAttribute("view-type", viewType);
    }

    if (detail.props) {
        let props = {...detail.props}
        let keys = Object.keys(props);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = props[key];
            if (value) {
                if (key == "src") {
                    if (value.url) {
                        let imageName = getFileNameBy(value.url);
                        if (imageName.indexOf(".") < 0) {
                            imageName += "." + value.type;
                        }
                        let imgPath = imageName;//只设置图片名，路径在外设置
                        ele.src = imgPath;
                        imageList.push(value);
                    }

                } else if ((viewType == "text" || viewType == "view-text" || !viewType) && key == "value") {
                    ele.innerText = value;
                } else if (key == "id") {
                    ele.setAttribute("view-id", value);
                } else if (key == "firstFocus") {
                    ele.setAttribute("first-focus", "");
                } else {
                    ele.setAttribute(key, value);
                }
            }
        }
    }

    if (viewType == "frame") {
        ele.setAttribute("view-id", forkData.label + "_frame");
    }

    if (detail.style) {
        let style = {...detail.style};
        if (sizeComponent.indexOf(viewType) >= 0) {
            let width = style.width;
            delete style.width;
            let height = style.height;
            delete style.height;
            ele.setAttribute("size", width + "," + height);
        } else {
            style.width = style.width + "px";
            style.height = style.height + "px";
            style.left = style.left + "px";
            style.top = style.top + "px";
            if (style.fontSize != undefined) {
                style.fontSize = style.fontSize + "px";
            }

            if (style.borderRadius != undefined) {
                style.borderRadius = style.borderRadius + "px";
            }
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

    let frameObj = {};

    if (forkData.children && forkData.children.length > 0) {
        for (let i = 0; i < forkData.children.length; i++) {
            let child = forkData.children[i];
            let childObj = buildLayout(pageName, child, viewDetailObj, frameObj);
            if (viewType != "frame") {
                ele.appendChild(childObj.ele);
                imageList = imageList.concat(childObj.imageList);

                Object.keys(childObj.frameObj).forEach(key => {
                    frameObj[key] = childObj.frameObj[key];
                })
            } else {
                delete childObj.frameObj;
                if (forkData.label) {
                    if (!frameObj[forkData.label]) {
                        frameObj[forkData.label] = [childObj]
                    } else {
                        frameObj[forkData.label].push(childObj);
                    }
                } else {
                    console.error("frame未填写name");
                }

            }
        }
    }
    console.log("frameObj", frameObj)
    return {ele, imageList, frameObj};

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

// let downloadPage = function (pageName, ele, imageList, frameObj) {
//     console.log({pageName, ele, imageList, frameObj})
//
//     const zip = new JSZip();
//
//     const promises = imageList.map(image => {
//         return fetch(image.url)
//             .then(response => response.blob())
//             .then(blob => {
//                 let folderPath = "code/images/" + pageName + "/";
//                 let fileName = getFileNameBy(image.url);
//                 if (fileName.indexOf(".") < 0) {
//                     fileName += "." + image.type;
//                 }
//                 let filePath = folderPath + fileName;
//
//                 zip.file(filePath, blob);
//             });
//     });
//
//     //写入page的html文件
//     let pageLayout = eleToHtml(ele);
//     const folderPath = "code/html/";
//     const filePath = folderPath + pageName + ".html";
//     zip.file(filePath, pageLayout);
//
//     promises.push(Promise.resolve());
//
//     Promise.all(promises)
//         .then(() => {
//             return zip.generateAsync({type: 'blob'});
//         }).then(content => {
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(content);
//         link.download = pageName + ".zip";
//         link.click();
//         URL.revokeObjectURL(link.href);
//     });
// }

let downloadPage = async function (pageName, ele, imageList, frameObj) {
    let zip = new JSZip();

    let frameNameObj = [];
    for (let frameName of Object.keys(frameObj)) {
        let frame = frameObj[frameName];
        frameNameObj[frameName + "_frame"] = [];
        for (let i = 0; i < frame.length; i++) {
            let fragmentObj = frame[i];
            let fragmentName = frameName + "_fragment_" + i;
            await putFrameToZip(pageName, fragmentName, fragmentObj.ele, fragmentObj.imageList, zip);

            frameNameObj[frameName + "_frame"].push(toPascalCase(fragmentName))
        }
    }

    await putPageToZip(pageName, ele, imageList, frameNameObj, zip);

    let content = await zip.generateAsync({type: 'blob'})

    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = pageName + ".zip";
    link.click();
    URL.revokeObjectURL(link.href);
}

let putPageToZip = async function (pageName, ele, imageList, frameNameObj, zip) {
    console.log({pageName, ele, imageList})

    let imageFolderPath = "code/images/" + pageName + "/";

    const promises = imageList.map(image => {
        return fetch(image.url)
            .then(response => response.blob())
            .then(blob => {
                let fileName = getFileNameBy(image.url);
                if (fileName.indexOf(".") < 0) {
                    fileName += "." + image.type;
                }
                let filePath = imageFolderPath + fileName;

                zip.file(filePath, blob);
            });
    });

    //处理ele中图片路径
    let srcPath = "../images/" + pageName + "/";
    let imgList = ele.querySelectorAll("img");
    imgList.forEach(img=>{
        img.src = srcPath + getFileNameBy(img.src);
    })

    //写入page的html文件
    let pageLayout = eleToHtml(ele);
    const htmlFolderPath = "code/html/";
    const htmlPath = htmlFolderPath + pageName + ".html";
    zip.file(htmlPath, pageLayout);

    let pasecalPageName = toPascalCase(pageName)
    let pageJs = buildPageJs(pageName, pasecalPageName, frameNameObj);
    const jsFolderPath = "code/page/";
    const jsPath = jsFolderPath + toPascalCase(pageName) + "Page" + ".js";
    zip.file(jsPath, pageJs);

    await Promise.all(promises).then();
}

let putFrameToZip = async function (pageName, fragmentName, ele, imageList, zip) {
    console.log({fragmentName, ele, imageList})

    let imageFolderPath = "code/images/" + pageName + "/" + fragmentName + "/";

    const promises = imageList.map(image => {
        return fetch(image.url)
            .then(response => response.blob())
            .then(blob => {
                let fileName = getFileNameBy(image.url);
                if (fileName.indexOf(".") < 0) {
                    fileName += "." + image.type;
                }
                let filePath = imageFolderPath + fileName;

                zip.file(filePath, blob);
            });
    });

    //处理ele中图片路径
    let srcPath = "../../../images/" + pageName + "/" + fragmentName + "/";
    let imgList = ele.querySelectorAll("img");
    imgList.forEach(img=>{
        img.src = srcPath + getFileNameBy(img.src);
    })

    //写入page的html文件
    let pageLayout = eleToHtml(ele);
    const htmlFolderPath = "code/html/fragment/" + pageName + "/";
    const htmlPath = htmlFolderPath + fragmentName + ".html";
    zip.file(htmlPath, pageLayout);

    let pasecalFragmentName = toPascalCase(fragmentName)
    let fragmentJs = buildFragmentJs(pageName, fragmentName, pasecalFragmentName);
    const jsFolderPath = "code/fragment/" + pageName + "/";
    const jsPath = jsFolderPath + pasecalFragmentName + ".js";
    zip.file(jsPath, fragmentJs);

    await Promise.all(promises).then();

    return zip;
}

/**
 * 获取链接中的文件名
 * @param url
 * @returns {string}
 */
let getFileNameBy = function (url) {
    let index = url.lastIndexOf("/");
    return url.substring(index + 1);
}

let eleToHtml = function (ele) {
    let html =
        "<template>" +
        ele.innerHTML
        + '</template>';
    var regExp_0 = new RegExp("><", "gmi");
    html = html.replace(regExp_0, ">\n<");
    // var regExp_1 = new RegExp("<", "gmi");
    // html = html.replace(regExp_1, "\n<");
    return html;
}

let buildPageJs = function (htmlName, jsName, frameNameObj) {
    let jsCode = `
import Page from "@core/frame/page/Page";\n`;

    Object.keys(frameNameObj).forEach(frameName => {
        frameNameObj[frameName].forEach(fragment => {
            jsCode += `import ` + fragment + ` from "@fragment/home/` + fragment + `";\n`
        })
    })


    jsCode += `
export default class ` + jsName + ` extends Page {
    onCreate(param) {
        this.setStyle("background","black");
        this.html = require("../html/` + htmlName + `.html");\n`

    Object.keys(frameNameObj).forEach(frameName => {
        jsCode += `
        this.` + frameName + ` = this.findViewById("` + frameName + `");
        this.` + frameName + `.addFragmentList([`;
        frameNameObj[frameName].forEach(fragment => {
            jsCode += `
            new ` + fragment + `(this.viewManager),`;
        })

        jsCode += `\n])`;
    })


    jsCode += `
    }
}`;

    return jsCode;
}

let buildFragmentJs = function (pageName, htmlName, jsName) {
    return `
import Fragment from "@core/frame/view/group/Fragment";

export default class ` + jsName + ` extends Fragment{
    onCreate() {
        this.html = require("../../html/fragment/` + pageName + `/` + htmlName + `.html")
    }

}
    `
}

let toPascalCase = function (word) {
    // 将单词按照空格或其他分隔符分割成数组
    const words = word.split(/[\s_-]+/);

    // 将数组中的每个单词的首字母大写
    const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // 将数组中的单词合并成一个字符串
    const pascalCaseWord = capitalizedWords.join('');

    return pascalCaseWord;
}

export default {
    getDataById,
    buildLayout,
    writeFile,
    downloadPage,
    getFileNameBy
}