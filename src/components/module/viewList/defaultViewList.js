let defaultViewList = [
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
        label: "按钮（中）",
        type: "focus",
        style: {
            width: 100,
            height: 50,
        },
        children: [
            {
                label: "背景",
                type: "div",
                style: {
                    width: 100,
                    height: 50,
                    background: "#808080",
                    borderRadius: 15,
                }
            },
            {
                label: "焦点",
                type: "div",
                style: {
                    width: 100,
                    height: 50,
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
                    width: 100,
                    height: 50,
                    background: "",
                    color: "#ffffff",
                    fontSize: 18,
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
        label: "按钮（小）",
        type: "focus",
        style: {
            width: 80,
            height: 40,
        },
        children: [
            {
                label: "背景",
                type: "div",
                style: {
                    width: 80,
                    height: 40,
                    background: "#808080",
                    borderRadius: 10,
                }
            },
            {
                label: "焦点",
                type: "div",
                style: {
                    width: 80,
                    height: 40,
                    background: "#ff0000",
                    borderRadius: 10,
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
                    width: 80,
                    height: 40,
                    background: "",
                    color: "#ffffff",
                    fontSize: 14,
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
    {
        label: "小图推荐位",
        type: "focus",
        style: {
            width: 176,
            height: 128,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 176,
                    height: 128,
                    borderRadius: 7,
                },
            }
        ]
    },

    {
        label: "内容推荐位",
        type: "focus",
        style: {
            width: 216,
            height: 280,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 216,
                    height: 280,
                    borderRadius: 7,
                },
            }
        ]
    },
    {
        label: "内容大推荐位",
        type: "focus",
        style: {
            width: 440,
            height: 280,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 440,
                    height: 280,
                    borderRadius: 7,
                },
            }
        ]
    },
    {
        label: "内容小推荐位",
        type: "focus",
        style: {
            width: 216,
            height: 134,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 216,
                    height: 134,
                    borderRadius: 7,
                },
            }
        ]
    },
    {
        label: "内容长推荐位",
        type: "focus",
        style: {
            width: 1134,
            height: 134,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 1134,
                    height: 134,
                    borderRadius: 7,
                },
            }
        ]
    },
];

export default defaultViewList;