let defaultViewList = [
    {
        label: "文字",
        type: "text",
        style: {
            width: 220,
            height: 22,
            background: "",
            color: "#ffffff",
            fontSize: 22,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textAlign: "left",
        },
        props: {
            value: "这是一段示例标题"
        }
    },
    {
        label: "文字栏目",
        type: "focus",
        style: {
            width: 122,
            height: 46,
        },
        children: [
            {
                label: "背景",
                type: "div",
                style: {
                    width: 122,
                    height: 46,
                    background: "#1f2023",
                    borderRadius: 5,
                }
            },
            {
                label: "文本",
                type: "text",
                style: {
                    left: 0,
                    top: 0,
                    width: 122,
                    height: 46,
                    background: "",
                    color: "#ffffff",
                    fontSize: 18,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "center",
                },
                props: {
                    value: "栏目"
                }
            }
        ]
    },
    {
        label: "图片栏目",
        type: "focus",
        style: {
            width: 122,
            height: 46,
        },
        children: [
            {
                label: "背景",
                type: "div",
                style: {
                    width: 122,
                    height: 46,
                    background: "#1f2023",
                    borderRadius: 5,
                }
            },
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 122,
                    height: 46,
                    borderRadius: 5,
                },
            },
        ]
    },
    {
        label: "海报位",
        type: "focus",
        style: {
            width: 205,
            height: 319,
            borderRadius: 7,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 205,
                    height: 258,
                },
            },
            {
                label: "文字背景",
                type: "div",
                style: {
                    width: 205,
                    height: 61,
                    top: 258,
                    background: "#1f2023",
                }
            },
            {
                label: "内容名",
                type: "text",
                style: {
                    width: 181,
                    height: 16,
                    top: 270,
                    left: 12,
                    color: "#ffffff",
                    fontSize: 16,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "left",
                },
                props: {
                    value: "这是一段示例内容名"
                }
            },
            {
                label: "说明",
                type: "text",
                style: {
                    width: 181,
                    height: 12,
                    top: 295,
                    left: 12,
                    color: "#58595d",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "left",
                },
                props: {
                    value: "这是一段示例说明"
                }
            }
        ]
    },
    {
        label: "预约海报位",
        type: "focus",
        style: {
            width: 205,
            height: 348,
            borderRadius: 7,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 205,
                    height: 258,
                },
            },
            {
                label: "文字背景",
                type: "div",
                style: {
                    width: 205,
                    height: 90,
                    top: 258,
                    background: "#1f2023",
                }
            },
            {
                label: "内容名",
                type: "text",
                style: {
                    width: 181,
                    height: 16,
                    top: 270,
                    left: 12,
                    color: "#ffffff",
                    fontSize: 16,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "left",
                },
                props: {
                    value: "这是一段示例内容名"
                }
            },
            {
                label: "预约背景",
                type: "div",
                style: {
                    width: 180,
                    height: 38,
                    top: 295,
                    left: 12,
                    background: "#1e2927",
                    borderRadius: 5,
                },
                props: {
                    value: "预约"
                }
            },
            {
                label: "预约",
                type: "text",
                style: {
                    width: 181,
                    height: 38,
                    top: 295,
                    left: 12,
                    color: "#019f5e",
                    fontSize: 16,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "center",
                },
                props: {
                    value: "预约"
                }
            }
        ]
    },
    {
        label: "横图位",
        type: "focus",
        style: {
            width: 254,
            height: 219,
            borderRadius: 7,
        },
        children: [
            {
                label: "内容图片",
                type: "img",
                style: {
                    width: 254,
                    height: 158,
                },
            },
            {
                label: "文字背景",
                type: "div",
                style: {
                    width: 254,
                    height: 61,
                    top: 158,
                    background: "#1f2023",
                }
            },
            {
                label: "内容名",
                type: "text",
                style: {
                    width: 207,
                    height: 16,
                    top: 170,
                    left: 12,
                    color: "#ffffff",
                    fontSize: 16,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "left",
                },
                props: {
                    value: "这是一段示例内容名"
                }
            },
            {
                label: "说明",
                type: "text",
                style: {
                    width: 207,
                    height: 12,
                    top: 195,
                    left: 12,
                    color: "#58595d",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textAlign: "left",
                },
                props: {
                    value: "这是一段示例说明"
                }
            }
        ]
    },
    {
        label: "横图楼层",
        type: "group",
        style: {
            width: 1280,
            height: 270,
            overflow: "hidden",
        }
    },
    {
        label: "海报楼层",
        type: "group",
        style: {
            width: 1280,
            height: 330,
            overflow: "hidden",
        }
    },
    {
        label: "海报楼层（带标题）",
        type: "group",
        style: {
            width: 1280,
            height: 370,
            overflow: "hidden",
        }
    },
    {
        label: "海报楼层（带标题、时间轴）",
        type: "group",
        style: {
            width: 1280,
            height: 430,
            overflow: "hidden",
        }
    },
    {
        label: "顶部轮播占位",
        type: "group",
        style: {
            width: 1280,
            height: 513,
            overflow: "hidden",
        }
    },
];
//44 184 324 464 604 744 884 1024 1164
//44 270 500 726 952 1183
//44 322 600 876 1155
export default defaultViewList;