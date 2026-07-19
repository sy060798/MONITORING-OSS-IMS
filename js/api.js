// ========================================
// OSS IMS MONITORING
// API JS V5 FINAL
// TAHAP 1 / 4
// CORE SYSTEM
// ========================================


// ========================================
// CONFIG
// ========================================

const API_URL =
"https://script.google.com/macros/s/AKfycby__Lw6UXk4CezUKiTHIs0F-EXmEK3eaQfyBkfckdBjXGc5dOJxRwtZ_ILbg9h54ylb/exec";


const PAGE_LIMIT = 100;





// ========================================
// CACHE
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




        return await response.json();



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
// GET ALL DATA
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





    return all;



}








// ========================================
// TEST API
// ========================================

async function testConnection(){



    return await safeRequest(

        "test",

        {}

    );


}








// ========================================
// REFRESH CACHE DASAR
// ========================================

async function refreshCache(){



    OSS_CACHE =
    await getAllData(

        "getOSS"

    );




    IMS_CACHE =
    await getAllData(

        "getIMS"

    );




    DONE_CACHE =
    await getAllData(

        "getDONE"

    );




    return true;



}







console.log(
"API JS V5 TAHAP 1 READY"
);

// ========================================
// OSS IMS MONITORING
// API JS V5 UPDATE
// TAHAP 2 / 4
// IMS + DONE + MASTER SYNC
// ========================================


// ========================================
// GET IMS
// ========================================

async function getIMS(page=1){


    const result = await pageRequest(
        "getIMS",
        page
    );


    if(result.success){


        IMS_CACHE = Array.isArray(result.data)
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



    IMS_CACHE=all;


    return all;


}








// ========================================
// GET DONE
// ========================================

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
// SYNC DONE APPSHEET
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
// FIND IMS ACTIVE
// ========================================

function findIMS(reference){



    return IMS_CACHE.find(item=>{


        return (

            String(
                item.reference_code
            )
            ===
            String(reference)

            &&

            item.FLAG !== "DELETE"

        );


    });


}









// ========================================
// CEK SUDAH DONE
// ========================================

function isAlreadyDone(reference){



    return DONE_CACHE.some(item=>{


        return String(
            item.reference_code
        )
        ===
        String(reference);



    });



}









// ========================================
// MASTER CLEAN FILTER
// ========================================

function cleanMasterData(data){



    if(!Array.isArray(data))
    return [];



    return data.filter(item=>{



        // sudah pindah DONE
        if(
            isAlreadyDone(
                item.reference_code
            )
        ){

            return false;

        }



        return true;



    });



}









// ========================================
// GET MASTER UPDATE
// ========================================

async function getMasterAPI(){



    // refresh data terbaru

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
// REFRESH DATA
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
// API JS V5 UPDATE
// TAHAP 3 / 4
// MASTER RENDER + DASHBOARD
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



        renderMaster(
            MASTER_CACHE
        );



    }
    catch(e){


        console.error(
            "MASTER LOAD ERROR",
            e
        );


        MASTER_CACHE=[];


    }



}









// ========================================
// RENDER MASTER
// ========================================

function renderMaster(data){



    const tbody =
    document.getElementById(
        "masterData"
    );



    if(!tbody)
    return;



    if(
        !Array.isArray(data)
        ||
        data.length===0
    ){


        tbody.innerHTML=`

        <tr>
            <td colspan="8">
                Tidak ada data aktif
            </td>
        </tr>

        `;


        return;


    }






    let html="";




    data.forEach(item=>{


        html += `

        <tr>

            <td>
            ${item.wo || "-"}
            </td>


            <td>
            ${item.reference_code || "-"}
            </td>


            <td>
            ${item.customer || "-"}
            </td>


            <td>
            ${item.city || "-"}
            </td>


            <td>
            ${item.bulan || "-"}
            </td>


            <td>
            ${item.job_name || "-"}
            </td>


            <td>
            ${item.status || "-"}
            </td>


            <td>
            ${item.note || ""}
            </td>


        </tr>

        `;


    });




    tbody.innerHTML=html;



}









// ========================================
// DASHBOARD LOAD
// ========================================

async function loadDashboard(){



    try{



        await refreshMasterSync();




        let master =
        MASTER_CACHE;




        let result={


            totalOSS:0,

            totalIMS:0,

            totalDONE:0,

            belumIMS:0,

            progress:0,

            revisi:0,

            selesai:0


        };






        const oss =
        await getAllOSS();




        const ims =
        await getAllIMS();




        const done =
        await getDONEAPI();






        result.totalOSS =
        oss.length;




        result.totalIMS =
        ims.length;




        result.totalDONE =
        done.length;







        master.forEach(item=>{



            if(
                item.status
                &&
                item.status.includes(
                    "Belum"
                )
            ){


                result.belumIMS++;


            }



            else if(
                item.status
                &&
                item.status.includes(
                    "Progress"
                )
            ){


                result.progress++;


            }



            else if(
                item.status
                &&
                item.status.includes(
                    "Revisi"
                )
            ){


                result.revisi++;


            }



            else if(
                item.status
                &&
                item.status.includes(
                    "Sudah"
                )
            ){


                result.selesai++;


            }



        });








        setText(
            "totalOSS",
            result.totalOSS
        );


        setText(
            "totalIMS",
            result.totalIMS
        );


        setText(
            "done",
            result.totalDONE
        );


        setText(
            "totalBelum",
            result.belumIMS
        );


        setText(
            "progress",
            result.progress
        );


        setText(
            "revisi",
            result.revisi
        );



        setText(
            "apiStatus",
            "🟢 ONLINE"
        );



    }

    catch(e){


        console.error(
            "DASHBOARD ERROR",
            e
        );



        setText(
            "apiStatus",
            "🔴 ERROR"
        );


    }




}









// ========================================
// REFRESH SEMUA
// ========================================

async function refreshAllData(){



    await getAllOSS();


    await refreshMasterSync();


    await loadDashboard();



    await loadMaster();



    return true;



}









// ========================================
// AUTO REFRESH
// ========================================

function startRealtime(){



    if(
        SYSTEM_INTERVAL
    ){

        clearInterval(
            SYSTEM_INTERVAL
        );

    }




    SYSTEM_INTERVAL =
    setInterval(()=>{


        refreshAllData();



    },60000);



}









console.log(
"API JS V5 TAHAP 3 READY"
);

 // ========================================
// OSS IMS MONITORING
// API JS V5 UPDATE
// TAHAP 4 / 4 FINAL
// SYSTEM CONTROL + INIT
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
    "toast "+type;



    el.style.display="block";




    setTimeout(()=>{


        el.style.display="none";


    },3000);



}









// ========================================
// MANUAL SYNC DONE BUTTON
// ========================================

async function manualSyncDONE(){



    try{



        showToast(
            "Sync DONE berjalan..."
        );




        const result =
        await syncDONEAPI();






        if(result.success){



            await refreshMasterSync();


            await loadMaster();


            await loadDashboard();




            showToast(
                result.message
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
// TEST API
// ========================================

async function testConnection(){



    const result =
    await safeRequest(

        "test",

        {}

    );



    return result;



}









// ========================================
// SYSTEM REFRESH
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
            "SYSTEM ERROR",
            e
        );



    }




}









// ========================================
// START AUTO REFRESH
// ========================================

function startRealtime(){



    stopRealtime();




    SYSTEM_INTERVAL =
    setInterval(()=>{


        refreshSystem();



    },60000);



}









// ========================================
// STOP REFRESH
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
            "START OSS IMS SYSTEM"
        );




        const api =
        await testConnection();




        if(!api.success){


            throw new Error(
                "API tidak aktif"
            );


        }





        await refreshSystem();




        startRealtime();




        SYSTEM_READY=true;




        setText(
            "apiStatus",
            "🟢 ONLINE"
        );





        console.log(
            "SYSTEM READY"
        );



    }
    catch(e){



        console.error(
            "INIT ERROR",
            e
        );



        setText(
            "apiStatus",
            "🔴 OFFLINE"
        );



    }



}









// ========================================
// CLEANUP
// ========================================

window.addEventListener(

"beforeunload",

()=>{


    stopRealtime();


});









// ========================================
// AUTO START WEB
// ========================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    initSystem();


});









console.log(
"API JS V5 FINAL COMPLETE"
);
