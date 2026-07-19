// ========================================
// OSS IMS MONITORING
// API JS V5 FINAL FIX
// TAHAP 1 / 4
// CORE + API REQUEST + OSS MODULE
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

let OSS_CACHE=[];

let IMS_CACHE=[];

let DONE_CACHE=[];

let MASTER_CACHE=[];







// ========================================
// API REQUEST
// ========================================

async function apiRequest(action,data={}){


    try{


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

            "API ERROR",

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
// SAFE REQUEST
// ========================================

async function safeRequest(action,data={}){


    const result =
    await apiRequest(

        action,

        data

    );



    if(!result.success){


        console.error(

            "API FAILED",

            result.message

        );


    }



    return result;


}







// ========================================
// PAGE REQUEST
// ========================================

async function pageRequest(action,page=1){



    return await safeRequest(

        action,

        {


            page:page,


            limit:PAGE_LIMIT


        }


    );


}








// ========================================
// GET ALL PAGE DATA
// ========================================

async function getAllData(action){



    let page=1;


    let all=[];




    while(true){



        const result =
        await pageRequest(

            action,

            page

        );




        if(

            !result.success ||

            !Array.isArray(result.data) ||

            result.data.length===0

        ){


            break;


        }




        all.push(

            ...result.data

        );





        if(

            result.data.length < PAGE_LIMIT

        ){


            break;


        }



        page++;



    }





    return all;



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
// OSS MODULE
// ========================================



// ========================================
// GET OSS PAGE
// ========================================

async function getOSS(page=1){



    const result =

    await pageRequest(

        "getOSS",

        page

    );





    if(result.success){



        OSS_CACHE =

        Array.isArray(result.data)

        ?

        result.data

        :

        [];



    }



    return OSS_CACHE;



}









// ========================================
// GET ALL OSS
// ========================================

async function getAllOSS(){



    let page=1;


    let all=[];





    while(true){



        const result =

        await pageRequest(

            "getOSS",

            page

        );






        if(


            !result.success ||


            !Array.isArray(result.data)


            ||


            result.data.length===0


        ){


            break;


        }





        all.push(

            ...result.data

        );





        if(

            result.data.length < PAGE_LIMIT

        ){


            break;


        }



        page++;



    }





    OSS_CACHE = all;



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

        String(reference);



    });



}









console.log(

"API JS V5 TAHAP 1 READY"

);

 // ========================================
// OSS IMS MONITORING
// API JS V5 FINAL FIX
// TAHAP 2 / 4
// IMS + DONE + MASTER SYNC
// ========================================




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




    if(result.success){



        IMS_CACHE =

        Array.isArray(result.data)

        ?

        result.data

        :

        [];



    }




    return IMS_CACHE;



}








// ========================================
// GET ALL IMS
// ========================================

async function getAllIMS(){



    let page=1;


    let all=[];




    while(true){



        const result =

        await pageRequest(

            "getIMS",

            page

        );





        if(


            !result.success ||


            !Array.isArray(result.data)


            ||


            result.data.length===0


        ){


            break;


        }





        all.push(

            ...result.data

        );





        if(

            result.data.length < PAGE_LIMIT

        ){


            break;


        }




        page++;



    }





    IMS_CACHE = all;



    return IMS_CACHE;



}








// ========================================
// FIND IMS
// ========================================

function findIMS(reference){



    return IMS_CACHE.find(item=>{



        return (



            String(

                item.reference_code || ""

            )

            ===

            String(reference)



            &&



            item.flag !== "DELETE"



        );



    });



}











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





    if(result.success){



        DONE_CACHE =


        Array.isArray(result.data)

        ?


        result.data

        :


        [];



    }





    return DONE_CACHE;



}









// ========================================
// GET ALL DONE
// ========================================

async function getAllDONE(){



    let page=1;


    let all=[];




    while(true){



        const result =

        await pageRequest(

            "getDONE",

            page

        );






        if(


            !result.success ||


            !Array.isArray(result.data)


            ||


            result.data.length===0


        ){


            break;


        }





        all.push(

            ...result.data

        );





        if(

            result.data.length < PAGE_LIMIT

        ){


            break;


        }




        page++;



    }





    DONE_CACHE = all;



    return DONE_CACHE;



}









// ========================================
// SYNC DONE
// ========================================

async function syncDONEAPI(){



    const result =

    await safeRequest(

        "syncDONE",

        {}

    );





    await getDONEAPI();



    await getIMS(1);





    return result;



}









// ========================================
// CEK SUDAH DONE
// ========================================

function isAlreadyDone(reference){



    return DONE_CACHE.some(item=>{



        return String(

            item.reference_code || ""

        )

        ===

        String(reference);



    });



}









// ========================================
// CLEAN MASTER DATA
// HAPUS DATA YANG SUDAH DONE
// ========================================

function cleanMasterData(data){



    if(!Array.isArray(data))

    return [];






    return data.filter(item=>{



        return !isAlreadyDone(

            item.reference_code

        );



    });



}











// ========================================
// GET MASTER API
// ========================================

async function getMasterAPI(){



    await getIMS(1);



    await getDONEAPI();





    const result =

    await safeRequest(

        "getMaster",

        {


            page:1,


            limit:PAGE_LIMIT


        }


    );





    if(result.success){



        MASTER_CACHE =

        cleanMasterData(

            result.data

        );



    }

    else{



        MASTER_CACHE=[];



    }





    return MASTER_CACHE;



}









// ========================================
// REFRESH MASTER SYNC
// ========================================

async function refreshMasterSync(){



    await syncDONEAPI();



    await getMasterAPI();



    return MASTER_CACHE;



}









console.log(

"API JS V5 TAHAP 2 READY"

);

// ========================================
// OSS IMS MONITORING
// API JS V5 FINAL FIX
// TAHAP 3 / 4
// MASTER + DASHBOARD + CACHE CONTROL
// ========================================




// ========================================
// LOAD MASTER WEB
// ========================================

async function loadMaster(){


    try{


        const data =

        await getMasterAPI();




        MASTER_CACHE =

        Array.isArray(data)

        ?

        data

        :

        [];





        if(typeof renderMaster==="function"){


            renderMaster(

                MASTER_CACHE

            );


        }





    }

    catch(error){



        console.error(

            "LOAD MASTER ERROR",

            error

        );



        MASTER_CACHE=[];



    }



}









// ========================================
// DASHBOARD
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
// LOAD DASHBOARD UI
// ========================================

async function loadDashboard(){



    try{



        const data =

        await getDashboardAPI();





        if(typeof setText==="function"){



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

    catch(e){



        console.error(

            "DASHBOARD ERROR",

            e

        );



        return {};



    }



}











// ========================================
// REFRESH SEMUA DATA
// ========================================

async function refreshAllData(){



    await getAllOSS();



    await refreshMasterSync();



    await loadDashboard();



    await loadMaster();



    return true;



}









// ========================================
// CLEAR CACHE
// ========================================

function clearCache(){



    OSS_CACHE=[];


    IMS_CACHE=[];


    DONE_CACHE=[];


    MASTER_CACHE=[];



}









// ========================================
// EXPORT DATA EXCEL
// ========================================

function exportExcel(data,name){



    if(typeof XLSX==="undefined"){



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









console.log(

"API JS V5 TAHAP 3 READY"

);

// ========================================
// OSS IMS MONITORING
// API JS V5 FINAL FIX
// TAHAP 4 / 4
// SYSTEM CONTROL + INIT + REALTIME
// ========================================




// ========================================
// SYSTEM STATE
// ========================================

let SYSTEM_READY = false;

let SYSTEM_INTERVAL = null;









// ========================================
// TOAST
// ========================================

function showToast(msg,type="success"){



    const el =

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
// MANUAL SYNC DONE
// ========================================

async function manualSyncDONE(){



    try{



        showToast(

            "Sync DONE berjalan..."

        );





        const result =

        await syncDONEAPI();






        if(result.success){



            await refreshAllData();





            showToast(

                result.message ||

                "DONE berhasil sync"

            );



        }

        else{



            showToast(

                result.message,

                "error"

            );


        }



    }

    catch(e){



        console.error(

            e

        );



        showToast(

            e.message,

            "error"

        );



    }



}











// ========================================
// REFRESH SYSTEM
// ========================================

async function refreshSystem(){



    try{



        await refreshMasterSync();



        await loadMaster();



        await loadDashboard();





        console.log(

            "SYSTEM UPDATE OK"

        );



    }

    catch(e){



        console.error(

            "SYSTEM REFRESH ERROR",

            e

        );



    }



}











// ========================================
// START REALTIME
// ========================================

function startRealtime(){



    stopRealtime();




    SYSTEM_INTERVAL =

    setInterval(()=>{



        refreshSystem();



    },60000);



}









// ========================================
// STOP REALTIME
// ========================================

function stopRealtime(){



    if(SYSTEM_INTERVAL){



        clearInterval(

            SYSTEM_INTERVAL

        );



        SYSTEM_INTERVAL=null;



    }



}











// ========================================
// TEST CONNECTION
// ========================================

async function checkAPI(){



    const result =

    await testConnection();




    return result;



}











// ========================================
// INIT SYSTEM
// ========================================

async function initSystem(){



    try{



        console.log(

            "START OSS IMS SYSTEM"

        );





        const api =

        await testConnection();





        if(!api.success){



            throw new Error(

                "API OFFLINE"

            );



        }





        await refreshAllData();





        startRealtime();





        SYSTEM_READY=true;






        if(typeof setText==="function"){



            setText(

                "apiStatus",

                "🟢 ONLINE"

            );



        }






        console.log(

            "SYSTEM READY"

        );



    }

    catch(error){



        console.error(

            "INIT ERROR",

            error

        );



        if(typeof setText==="function"){



            setText(

                "apiStatus",

                "🔴 OFFLINE"

            );



        }



    }



}









// ========================================
// GLOBAL ACCESS
// ========================================

window.getOSS =
getOSS;


window.getAllOSS =
getAllOSS;


window.getIMS =
getIMS;


window.getAllIMS =
getAllIMS;


window.getDONEAPI =
getDONEAPI;


window.syncDONEAPI =
syncDONEAPI;


window.getMasterAPI =
getMasterAPI;


window.refreshSystem =
refreshSystem;


window.manualSyncDONE =
manualSyncDONE;


window.exportOSS =
exportOSS;


window.exportIMS =
exportIMS;


window.exportDONE =
exportDONE;









// ========================================
// AUTO START
// ========================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    initSystem();


});









// ========================================
// CLEANUP
// ========================================

window.addEventListener(

"beforeunload",

()=>{


    stopRealtime();


});









console.log(

"API JS V5 FINAL COMPLETE"

);

// ========================================
// IMPORT FILTER DUPLIKAT
// TEMPPEL PALING BAWAH api.js
// ========================================

function removeDuplicateByReference(rows){

    const map = {};

    return rows.filter(item=>{

        const ref = String(
            item.reference_code || ""
        ).trim();

        if(!ref){

            return false;

        }

        if(map[ref]){

            return false;

        }

        map[ref] = true;

        return true;

    });

}
