let boardWidth = 5;

/**
 * 内部只有基础节点的控件
 * @type {string[]}
 */
let insideConnot = ["focus", "button"];

let judgeDownType = function (event, operateComponent) {
    let width = operateComponent.width;
    let height = operateComponent.height;
    let left = event.offsetX;
    let top = event.offsetY;

    let downType = "";
    if (left >= 0 && left <= width && top >= 0 && top <= height) {
        if (width < boardWidth * 2 || height < boardWidth * 2) {
            downType = "move";
        } else {
            if (left <= boardWidth) {
                downType = "resize left";
            } else if (left >= width - boardWidth) {
                downType = "resize right";
            } else if (top <= boardWidth) {
                downType = "resize top";
            } else if (top >= height - boardWidth) {
                downType = "resize bottom";
            } else {
                downType = "move";
            }
        }
    }


    return downType;
}

let getImageSize = function (file) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = function () {
            const width = img.width;
            const height = img.height;
            resolve({width, height});
        };

        img.onerror = function () {
            reject(new Error('无法加载图像文件'));
        };

        img.src = file.url;
    });
}

/**
 * 计算不同size的view在预览中对应的校准
 * @param width
 * @param height
 * @returns {number}
 */
let correctPreviewBy = function (width, height) {
    let rateV = 60 * 0.8 / height;
    let rateH = 150 * 0.8 / width;

    let rate = (rateV < rateH ? rateV : rateH);

    let left = (150 - width) / 2;
    let top = (60 - height) / 2;

    return {rate, left, top};
}

export default {
    boardWidth,
    insideConnot,
    judgeDownType,
    getImageSize,
    correctPreviewBy
}