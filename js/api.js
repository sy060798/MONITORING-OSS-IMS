// ========================================
// OSS IMS MONITORING
// API JS V6 UPDATE
// TAHAP 1 / 4
// CORE + API REQUEST + PAGINATION FIX
// ========================================


// ========================================
// CONFIG
// ========================================

const API_URL =
"https://script.google.com/macros/s/AKfycby__Lw6UXk4CezUKiTHIs0F-EXmEK3eaQfyBkfckdBjXGc5dOJxRwtZ_ILbg9h54ylb/exec";


const PAGE_LIMIT = 100;





// ========================================
// GLOBAL CACHE
// ========================================

window.OSS_CACHE =
window.OSS_CACHE || [];


window.IMS_CACHE =
window.IMS_CACHE || [];


window.DONE_CACHE =
window.DONE_CACHE || [];


window.MASTER_CACHE =
window.MASTER_CACHE || [];








// ========================================
// API REQUEST CORE
// ========================================

async function apiRequest(action,data={}){


    try{


        console.log(
            "API REQUEST",
            action,
            data
        );



        const response =

        await fetch(

            API_URL,

            {

                method:"POST",


                headers:{


                    "Content-Type":
                    "text/plain;charset=utf-8"


                },


                body:JSON.stringify({

                    action:action,

                    data:data

                })


            }

        );





        const json =

        await response.json();





        console.log(

            "API RESPONSE",

            action,

            json

        );





        return json;



    }


    catch(error){



        console.error(

            "API REQUEST ERROR",

            error

        );



        return {


            success:false,


            data:[],


            message:error.message


        };


    }



}









// ========================================
// SAFE API
// ========================================

async function safeRequest(action,data={}){


    let result =

    await apiRequest(

        action,

        data

    );




    if(

        !result ||

        result.success!==true

    ){


        console.error(

            "API FAILED",

            action,

            result

        );


    }





    return result;



}









// ========================================
// PAGE REQUEST FIX
// ========================================

async function pageRequest(action,page=1,limit=PAGE_LIMIT){



    return await safeRequest(

        action,

        {


            page:page,


            limit:limit


        }

    );



}









// ========================================
// GET ALL PAGE DATA
// ========================================

async function getAllData(action){



    let page=1;


    let resultData=[];




    while(true){



        let response =

        await pageRequest(

            action,

            page

        );






        if(

            !response ||

            response.success!==true ||

            !Array.isArray(response.data)

        ){

            break;

        }






        if(

            response.data.length===0

        ){

            break;

        }






        resultData.push(

            ...response.data

        );







        if(

            response.data.length < PAGE_LIMIT

        ){

            break;

        }





        page++;



    }







    return resultData;



}









// ========================================
// TEST CONNECTION
// ========================================

async function testConnection(){


    return await safeRequest(

        "test",

        {}

    );


}









// ========================================
// CLEAR CACHE
// ========================================

function clearAllCache(){



    OSS_CACHE=[];


    IMS_CACHE=[];


    DONE_CACHE=[];


    MASTER_CACHE=[];



}









// ========================================
// EXPORT GLOBAL
// ========================================

window.apiRequest =
apiRequest;


window.safeRequest =
safeRequest;


window.pageRequest =
pageRequest;


window.getAllData =
getAllData;


window.testConnection =
testConnection;


window.clearAllCache =
clearAllCache;








console.log(

"API JS V6 TAHAP 1 READY"

);
// ========================================
// OSS IMS MONITORING
// API JS V6 UPDATE
// TAHAP 2 / 4
// OSS + IMS MODULE FIX
// ========================================


// ========================================
// OSS MODULE
// ========================================


// GET OSS PAGE

async function getOSS(page=1){



    const result =

    await pageRequest(

        "getOSS",

        page

    );





    if(

        result &&

        result.success===true

    ){



        OSS_CACHE =

        Array.isArray(

            result.data

        )

        ?

        result.data

        :

        [];



    }

    else{



        OSS_CACHE=[];



    }







    return OSS_CACHE;



}









// ========================================
// GET ALL OSS
// ========================================

async function getAllOSS(){



    let data=[];


    let page=1;






    while(true){



        let result =

        await pageRequest(

            "getOSS",

            page

        );







        if(

            !result ||

            result.success!==true ||

            !Array.isArray(result.data)

        ){

            break;

        }







        if(

            result.data.length===0

        ){

            break;

        }







        data.push(

            ...result.data

        );







        if(

            result.data.length < PAGE_LIMIT

        ){

            break;

        }







        page++;




    }








    OSS_CACHE = data;





    return OSS_CACHE;



}









// ========================================
// FIND OSS
// ========================================

function findOSS(reference){



    return OSS_CACHE.find(item=>{


        return String(

            item.reference_code || ""

        )

        ===

        String(reference || "");



    });



}









// ========================================
// ADD OSS
// ========================================

async function addOSS(data){



    return await safeRequest(

        "addOSS",

        data

    );



}









// ========================================
// UPDATE OSS
// ========================================

async function updateOSS(data){



    return await safeRequest(

        "updateOSS",

        data

    );



}









// ========================================
// DELETE OSS
// ========================================

async function deleteOSS(id){



    return await safeRequest(

        "deleteOSS",

        {

            id:id

        }

    );


}











// ========================================
// IMS MODULE
// ========================================


// GET IMS PAGE

async function getIMS(page=1){



    const result =

    await pageRequest(

        "getIMS",

        page

    );





    if(

        result &&

        result.success===true

    ){



        IMS_CACHE =

        Array.isArray(

            result.data

        )

        ?

        result.data

        :

        [];



    }

    else{



        IMS_CACHE=[];



    }






    return IMS_CACHE;



}









// ========================================
// GET ALL IMS
// ========================================

async function getAllIMS(){



    let data=[];


    let page=1;






    while(true){



        let result =

        await pageRequest(

            "getIMS",

            page

        );







        if(

            !result ||

            result.success!==true ||

            !Array.isArray(result.data)

        ){

            break;

        }






        if(

            result.data.length===0

        ){

            break;

        }







        data.push(

            ...result.data

        );







        if(

            result.data.length < PAGE_LIMIT

        ){

            break;

        }







        page++;




    }







    IMS_CACHE=data;





    return IMS_CACHE;



}









// ========================================
// FIND IMS
// ========================================

function findIMS(reference){



    return IMS_CACHE.find(item=>{


        return String(

            item.reference_code || ""

        )

        ===

        String(reference || "");



    });



}









// ========================================
// ADD IMS
// ========================================

async function addIMS(data){



    return await safeRequest(

        "addIMS",

        data

    );


}









// ========================================
// UPDATE IMS
// ========================================

async function updateIMS(data){



    return await safeRequest(

        "updateIMS",

        data

    );


}









// ========================================
// DELETE IMS
// ========================================

async function deleteIMS(id){



    return await safeRequest(

        "deleteIMS",

        {

            id:id

        }

    );


}









// ========================================
// GLOBAL EXPORT
// ========================================

window.getOSS =
getOSS;


window.getAllOSS =
getAllOSS;


window.findOSS =
findOSS;


window.addOSS =
addOSS;


window.updateOSS =
updateOSS;


window.deleteOSS =
deleteOSS;



window.getIMS =
getIMS;


window.getAllIMS =
getAllIMS;


window.findIMS =
findIMS;


window.addIMS =
addIMS;


window.updateIMS =
updateIMS;


window.deleteIMS =
deleteIMS;








console.log(

"API JS V6 TAHAP 2 READY"

);
// ========================================
// OSS IMS MONITORING
// API JS V6 UPDATE
// TAHAP 3 / 4
// DONE + MASTER + DASHBOARD SYNC
// ========================================


// ========================================
// DONE MODULE
// ========================================


// GET DONE

async function getDONEAPI(){



    const result =

    await safeRequest(

        "getDONE",

        {

            page:1,

            limit:PAGE_LIMIT

        }

    );





    if(

        result &&

        result.success===true

    ){


        DONE_CACHE =

        Array.isArray(

            result.data

        )

        ?

        result.data

        :

        [];


    }

    else{


        DONE_CACHE=[];


    }







    return DONE_CACHE;



}









// ========================================
// GET ALL DONE
// ========================================

async function getAllDONE(){



    let data=[];


    let page=1;






    while(true){



        let result =

        await pageRequest(

            "getDONE",

            page

        );







        if(

            !result ||

            result.success!==true ||

            !Array.isArray(result.data)

        ){

            break;

        }







        if(

            result.data.length===0

        ){

            break;

        }







        data.push(

            ...result.data

        );








        if(

            result.data.length < PAGE_LIMIT

        ){

            break;

        }






        page++;



    }








    DONE_CACHE=data;






    return DONE_CACHE;



}











// ========================================
// CHECK DONE
// ========================================

function isAlreadyDone(reference){



    return DONE_CACHE.some(item=>{


        return String(

            item.reference_code || ""

        )

        ===

        String(reference || "");



    });



}









// ========================================
// MASTER MODULE
// ========================================


// GET MASTER

async function getMasterAPI(){



    const result =

    await safeRequest(

        "getMaster",

        {

            page:1,

            limit:PAGE_LIMIT

        }

    );






    if(

        result &&

        result.success===true

    ){



        MASTER_CACHE =

        Array.isArray(

            result.data

        )

        ?

        result.data

        :

        [];



    }

    else{



        MASTER_CACHE=[];


    }








    return cleanMasterData(

        MASTER_CACHE

    );



}









// ========================================
// CLEAN MASTER
// ========================================

function cleanMasterData(data){



    if(

        !Array.isArray(data)

    ){

        return [];

    }








    return data.filter(item=>{


        return !isAlreadyDone(

            item.reference_code

        );


    });



}









// ========================================
// REFRESH MASTER
// ========================================

async function refreshMasterSync(){



    await getDONEAPI();



    let master =

    await getMasterAPI();





    MASTER_CACHE = master;






    return MASTER_CACHE;



}









// ========================================
// DASHBOARD DATA
// ========================================

async function getDashboardAPI(){



    await getAllOSS();


    await getAllIMS();


    await getAllDONE();





    let result={



        totalOSS:

        OSS_CACHE.length,



        totalIMS:

        IMS_CACHE.length,



        totalDONE:

        DONE_CACHE.length,



        belumIMS:0,


        progress:0,


        revisi:0,


        selesai:0



    };








    MASTER_CACHE.forEach(item=>{



        let status =

        String(

            item.status || ""

        );






        if(

            status.includes(

                "Belum"

            )

        ){


            result.belumIMS++;


        }


        else if(

            status.includes(

                "Progress"

            )

        ){


            result.progress++;


        }


        else if(

            status.includes(

                "Revisi"

            )

        ){


            result.revisi++;


        }


        else if(

            status.includes(

                "Sudah"

            )

        ){


            result.selesai++;


        }



    });








    return result;



}









// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard(){



    try{



        const data =

        await getDashboardAPI();







        if(

            typeof setText==="function"

        ){



            setText(

                "totalOSS",

                data.totalOSS

            );



            setText(

                "totalIMS",

                data.totalIMS

            );



            setText(

                "done",

                data.totalDONE

            );



            setText(

                "totalBelum",

                data.belumIMS

            );



            setText(

                "progress",

                data.progress

            );



            setText(

                "revisi",

                data.revisi

            );



            setText(

                "apiStatus",

                "🟢 ONLINE"

            );



        }







        return data;



    }

    catch(error){



        console.error(

            "DASHBOARD ERROR",

            error

        );



        return {};



    }



}









// ========================================
// REFRESH ALL DATA
// ========================================

async function refreshAllData(){



    await getAllOSS();



    await getAllIMS();



    await refreshMasterSync();



    await loadDashboard();





    return true;



}









// ========================================
// EXPORT EXCEL
// ========================================

function exportExcel(data,name){



    if(

        typeof XLSX==="undefined"

    ){


        alert(

            "Library Excel belum aktif"

        );


        return;


    }






    let ws =

    XLSX.utils.json_to_sheet(

        data

    );






    let wb =

    XLSX.utils.book_new();






    XLSX.utils.book_append_sheet(

        wb,

        ws,

        name

    );







    XLSX.writeFile(

        wb,

        name+".xlsx"

    );



}









function exportOSS(){


    exportExcel(

        OSS_CACHE,

        "OSS"

    );


}





function exportIMS(){


    exportExcel(

        IMS_CACHE,

        "IMS"

    );


}





function exportDONE(){


    exportExcel(

        DONE_CACHE,

        "DONE"

    );


}









// ========================================
// GLOBAL EXPORT
// ========================================

window.getDONEAPI =
getDONEAPI;


window.getAllDONE =
getAllDONE;


window.getMasterAPI =
getMasterAPI;


window.refreshMasterSync =
refreshMasterSync;


window.getDashboardAPI =
getDashboardAPI;


window.loadDashboard =
loadDashboard;


window.refreshAllData =
refreshAllData;


window.exportExcel =
exportExcel;


window.exportOSS =
exportOSS;


window.exportIMS =
exportIMS;


window.exportDONE =
exportDONE;








console.log(

"API JS V6 TAHAP 3 READY"

);
// ========================================
// OSS IMS MONITORING
// API JS V6 UPDATE
// TAHAP 4 / 4 FINAL
// SYSTEM CONTROL + REALTIME + INIT
// ========================================


// ========================================
// SYSTEM STATE
// ========================================

window.SYSTEM_READY =
false;


window.SYSTEM_INTERVAL =
null;









// ========================================
// TOAST
// ========================================

function showToast(msg,type="success"){



    let el =

    document.getElementById(

        "toast"

    );



    if(!el)

    return;





    el.innerHTML = msg;



    el.className =

    "toast " + type;



    el.style.display="block";







    setTimeout(()=>{


        el.style.display="none";


    },3000);



}









// ========================================
// TEST API
// ========================================

async function checkAPI(){



    try{



        let result =

        await testConnection();





        return result.success===true;



    }

    catch(error){



        return false;


    }



}









// ========================================
// MANUAL REFRESH SYSTEM
// ========================================

async function refreshSystem(){



    try{



        console.log(

            "SYSTEM REFRESH START"

        );







        await refreshAllData();







        if(

            typeof renderOSS==="function"

        ){


            renderOSS(

                OSS_CACHE

            );


        }








        if(

            typeof renderIMS==="function"

        ){


            renderIMS(

                IMS_CACHE

            );


        }








        console.log(

            "SYSTEM REFRESH OK"

        );



        return true;



    }

    catch(error){



        console.error(

            "SYSTEM REFRESH ERROR",

            error

        );



        return false;



    }



}









// ========================================
// REALTIME START
// ========================================

function startRealtime(){



    stopRealtime();






    SYSTEM_INTERVAL =

    setInterval(async()=>{



        await refreshSystem();





    },60000);



}









// ========================================
// STOP REALTIME
// ========================================

function stopRealtime(){



    if(

        SYSTEM_INTERVAL

    ){



        clearInterval(

            SYSTEM_INTERVAL

        );



        SYSTEM_INTERVAL=null;



    }



}









// ========================================
// INIT SYSTEM
// ========================================

async function initSystem(){



    try{



        console.log(

            "START OSS IMS SYSTEM V6"

        );







        let api =

        await testConnection();








        if(

            !api ||

            api.success!==true

        ){



            throw new Error(

                "API OFFLINE"

            );


        }








        await refreshAllData();








        if(

            typeof renderOSS==="function"

        ){


            renderOSS(

                OSS_CACHE

            );


        }








        if(

            typeof renderIMS==="function"

        ){


            renderIMS(

                IMS_CACHE

            );


        }








        startRealtime();








        SYSTEM_READY=true;








        if(

            typeof setText==="function"

        ){


            setText(

                "apiStatus",

                "🟢 ONLINE"

            );


        }







        console.log(

            "OSS IMS SYSTEM READY"

        );



    }

    catch(error){



        console.error(

            "SYSTEM INIT ERROR",

            error

        );







        if(

            typeof setText==="function"

        ){



            setText(

                "apiStatus",

                "🔴 OFFLINE"

            );



        }



    }



}









// ========================================
// KEYBOARD REFRESH
// ========================================

document.addEventListener(

"keydown",

function(e){



    if(

        e.ctrlKey &&

        e.key==="r"

    ){



        e.preventDefault();



        refreshSystem();



    }



}

);









// ========================================
// AUTO START
// ========================================

document.addEventListener(

"DOMContentLoaded",

()=>{



    setTimeout(()=>{


        initSystem();


    },300);



}

);









// ========================================
// CLEANUP
// ========================================

window.addEventListener(

"beforeunload",

()=>{


    stopRealtime();


}

);









// ========================================
// GLOBAL EXPORT
// ========================================

window.initSystem =
initSystem;


window.refreshSystem =
refreshSystem;


window.startRealtime =
startRealtime;


window.stopRealtime =
stopRealtime;


window.checkAPI =
checkAPI;


window.showToast =
showToast;









console.log(

"================================"

);


console.log(

"API JS V6 FINAL READY"

);


console.log(

"OSS + IMS + DONE + MASTER ACTIVE"

);


console.log(

"================================"

);
