let viewList = [
    {
        label: "楼层组",
        type: "group",
        style: {
            width: 1280,
            height: 300,
            overflow: "hidden",
        }
    },
    {
        label: "文字",
        type: "text",
        style: {
            width: 176,
            height: 30,
            background: "",
            color: "#ffffff",
            fontSize: 22,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textAlign: "left",
        },
        props: {
            value: "这是一段示例文字"
        }
    },
    {
        label: "页面背景",
        type: "img",
        style: {
            width: 1280,
            height: 720,
            borderRadius: 0,
        },
    },
    {
        label: "横线",
        type: "div",
        style: {
            width: 1280,
            height: 1,
            background: "#ff0000",
            borderRadius: 0,
        },
    },
    {
        label: "按钮",
        type: "focus",
        style: {
            width: 120,
            height: 60,
        },
        children: [
            {
                label: "背景",
                type: "div",
                style: {
                    width: 120,
                    height: 60,
                    background: "#808080",
                    borderRadius: 15,
                }
            },
            {
                label: "焦点",
                type: "div",
                style: {
                    width: 120,
                    height: 60,
                    background: "#ff0000",
                    borderRadius: 15,
                },
                props: {
                    id: "focus"
                }
            },
            {
                label: "文本",
                type: "text",
                style: {
                    left: 0,
                    top: 0,
                    width: 120,
                    height: 60,
                    background: "",
                    color: "#ffffff",
                    fontSize: 22,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "center",
                },
                props: {
                    value: "按钮"
                }
            }
        ]
    },
    {
        label: "内容推荐位",
        type: "focus",
        style: {
            width: 176,
            height: 302,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 176,
                    height: 272,
                    borderRadius: 7,
                },
            },
            {
                label: "内容名",
                type: "text",
                style: {
                    width: 176,
                    height: 30,
                    top: 272,
                    background: "#ffffff",
                    color: "#000000",
                    fontSize: 18,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "center",
                },
                props: {
                    value: "这是一段示例内容名"
                }
            }
        ]
    },
    {
        label: "内容推荐位",
        type: "focus",
        style: {
            width: 176,
            height: 272,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 176,
                    height: 272,
                    borderRadius: 7,
                },
            }
        ]
    },
    {
        label: "大图推荐位",
        type: "focus",
        style: {
            width: 430,
            height: 272,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 430,
                    height: 272,
                    borderRadius: 7,
                },
            }
        ]
    },
];


export default viewList;