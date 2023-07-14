let data = {
    children: [
        {
            type: "img",
            props: {
                src: require("./assets/bg.jpg")
            },
            style: {
                width: "1280px",
                height: "720px",
            },
        },
        {
            type: "img",
            props: {
                src: require("./assets/logo.png")
            },
            style: {
                width: "50px",
                height: "50px",
                left: "40px",
                top: "30px",
            },
        },
        {
            style: {
                width: "1280px",
                height: "1px",
                top: "100px",
                background:"gray"
            },
        },
        {
            type: "text",
            props: {
                value:"这是一个标题"
            },
            style: {
                width: "50px",
                height: "50px",
                left: "40px",
                top: "120px",
            },
        },
        {
            type: "group",
            style: {
                width: "1280px",
                height: "350px",
                top: "150px",
            },
            children:[
                {
                    type: "button",
                    props: {
                        value:"按钮1"
                    },
                    style: {
                        left: "50px",
                        top: "50px",
                    },
                },
                {
                    type: "button",
                    props: {
                        value:"按钮2"
                    },
                    style: {
                        left: "250px",
                        top: "50px",
                    },
                },
            ]
        }
    ]
}

export default data;