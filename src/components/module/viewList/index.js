import defaultViewList from "@/components/module/viewList/defaultViewList";
import aiqiyiViewList from "@/components/module/viewList/aiqiyiViewList";

let viewList = [];

let type = "aiqiyi";

switch (type){
    case "aiqiyi":
        viewList = aiqiyiViewList;
        break;
    default:
        viewList = defaultViewList;
        break;
}


export default viewList;
