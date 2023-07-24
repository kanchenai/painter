let data = {
    children: [
        {
            type: "img",
            props: {
                src: require("./assets/bg.jpg")
            },
            style: {
                width: "1280",
                height: "720",
            },
        },
        {
            type: "img",
            props: {
                src: require("./assets/logo.png")
            },
            style: {
                width: "50",
                height: "50",
                left: "40",
                top: "30",
            },
        },
        {
            style: {
                width: "1280",
                height: "1",
                top: "100",
                background: "gray"
            },
        },
        {
            type: "text",
            props: {
                value: "这是一个标题"
            },
            style: {
                width: "50",
                height: "50",
                left: "40",
                top: "120",
            },
        },
        {
            type: "group",
            style: {
                width: "1280",
                height: "350",
                top: "150",
            },
            children: [
                {
                    type: "button",
                    props: {
                        value: "按钮1"
                    },
                    style: {
                        left: "50",
                        top: "50",
                    },
                },
                {
                    type: "button",
                    props: {
                        value: "按钮2"
                    },
                    style: {
                        left: "250",
                        top: "50",
                    },
                },
            ]
        }
    ]
}

let treeData = [
    {
        id: 1,
        label: "HomePage",
        children: [
            {}
        ]
    },
    {
        id: 2,
        label: "DetailPage",
        children: [
            {}
        ]
    },
    {
        id: 3,
        label: "ListPage",
        children: [
            {}
        ]
    },
];


let configMap = new Map();

configMap.set(1, {
    type: "group",
    style: {
        width: 1280,
        height: 720,
    }
})

configMap.set(2, {
    type: "group",
    style: {
        width: 1280,
        height: 720,
    }
})

configMap.set(3, {
    type: "group",
    style: {
        width: 1280,
        height: 720,
    }
})


export default data;