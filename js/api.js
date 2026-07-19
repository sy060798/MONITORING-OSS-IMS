// ========================================
// OSS IMS MONITORING
// API CONNECTOR V3
// HIGH PERFORMANCE BIG DATA
// ========================================


// ========================================
// CONFIG
// ========================================


const API_URL =

"https://script.google.com/macros/s/AKfycby__Lw6UXk4CezUKiTHIs0F-EXmEK3eaQfyBkfckdBjXGc5dOJxRwtZ_ILbg9h54ylb/exec";





// ========================================
// CACHE LOCAL
// ========================================


let OSS_CACHE = [];

let IMS_CACHE = [];

let MASTER_CACHE = [];





// server paging
const LOAD_LIMIT = 100;





// ========================================
// CORE API REQUEST
// ========================================


async function apiRequest(action,data={}){


    try{


        const response = await fetch(

            API_URL,

            {

                method:"POST",

                headers:{

                    "Content-Type":

                    "text/plain;charset=utf-8"

                },


                body:

                JSON.stringify({

                    action:action,

                    data:data

                })


            }

        );





        const result =

        await response.json();




        console.log(

            "API",

            action,

            result

        );




        return result;



    }


    catch(error){



        console.error(

            "API ERROR",

            error

        );



        return {


            success:false,


            message:error.message,


            data:[]

        };



    }


}









// ========================================
// SAFE API
// ========================================


async function safeRequest(action,data={}){


    const result =

    await apiRequest(

        action,

        data

    );




    if(

        !result ||

        result.success===false

    ){


        if(typeof showToast==="function"){


            showToast(

                result.message ||

                "API ERROR",

                "error"

            );

        }


        return {


            success:false,


            data:[]

        };


    }



    return result;



}









// ========================================
// CONNECTION TEST
// ========================================


async function testConnection(){


    return await safeRequest(

        "test",

        {}

    );


}









// ========================================
// PAGING REQUEST
// ========================================


async function pageRequest(action,page=1){



    return await safeRequest(

        action,

        {

            page:page,

            limit:LOAD_LIMIT

        }

    );


}








console.log(
"API JS V3 CORE READY"
);
// ========================================
// OSS MODULE V3
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

        result.data || [];



        return OSS_CACHE;



    }



    return [];



}







// ========================================
// GET ALL OSS
// EXPORT / BACKUP
// jangan dipakai untuk tampilan
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

            !result.data ||

            result.data.length===0

        ){

            break;

        }





        all.push(

            ...result.data

        );





        if(

            result.data.length < LOAD_LIMIT

        ){

            break;

        }



        page++;



    }





    OSS_CACHE=all;



    return all;



}








// ========================================
// ADD OSS
// ========================================


async function addOSSAPI(data){



    const result =

    await safeRequest(

        "addOSS",

        {


            reference_code:

            data.reference_code || "",



            cust_id:

            data.cust_id || "",



            customer:

            data.customer || "",



            city:

            data.city || ""



        }

    );





    await refreshOSSCache();



    return result;



}








// ========================================
// UPDATE OSS
// ========================================


async function updateOSSAPI(data){



    const result =

    await safeRequest(

        "updateOSS",

        {


            id:data.id,


            reference_code:

            data.reference_code || "",



            cust_id:

            data.cust_id || "",



            customer:

            data.customer || "",



            city:

            data.city || ""



        }

    );





    await refreshOSSCache();



    return result;



}









// ========================================
// DELETE OSS
// ========================================


async function deleteOSSAPI(id){



    const result =

    await safeRequest(

        "deleteOSS",

        {

            id:id

        }

    );





    await refreshOSSCache();



    return result;



}








// ========================================
// BULK IMPORT OSS EXCEL
// ========================================


async function bulkAddOSSAPI(rows){



    const result =

    await safeRequest(

        "bulkOSS",

        rows

    );




    await refreshOSSCache();



    return result;



}








// ========================================
// REFRESH OSS CACHE
// ========================================


async function refreshOSSCache(){



    OSS_CACHE=[];



    return await getOSS(1);



}








// ========================================
// FIND OSS
// ========================================


function findOSS(reference_code){



    return OSS_CACHE.find(item=>


        String(item.reference_code)

        ===

        String(reference_code)


    );


}









// ========================================
// IMS MODULE V3
// ========================================







// ========================================
// GET IMS ACTIVE
// ========================================


async function getIMS(page=1){



    const result =

    await pageRequest(

        "getIMS",

        page

    );





    if(result.success){



        IMS_CACHE =

        result.data || [];



        return IMS_CACHE;



    }



    return [];



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

            !result.data ||

            result.data.length===0

        ){

            break;

        }






        all.push(

            ...result.data

        );





        if(

            result.data.length < LOAD_LIMIT

        ){

            break;

        }




        page++;



    }





    IMS_CACHE=all;



    return all;



}








// ========================================
// ADD IMS
// ========================================


async function addIMSAPI(data){



    const result =

    await safeRequest(

        "addIMS",

        {



            wo:

            data.wo || "",



            reference_code:

            data.reference_code || "",



            quotation:

            data.quotation || "",



            job_name:

            data.job_name || "",



            status:

            data.status || "Progress",



            bulan:

            data.bulan || ""



        }


    );





    await refreshIMSCache();



    return result;



}








// ========================================
// UPDATE IMS
// ========================================


async function updateIMSAPI(data){



    const result =

    await safeRequest(

        "updateIMS",

        {



            id:data.id,


            wo:

            data.wo || "",



            reference_code:

            data.reference_code || "",



            quotation:

            data.quotation || "",



            job_name:

            data.job_name || "",



            status:

            data.status || "Progress",



            bulan:

            data.bulan || ""



        }


    );





    await refreshIMSCache();



    return result;



}








// ========================================
// DELETE IMS
// ========================================


async function deleteIMSAPI(id){



    const result =

    await safeRequest(

        "deleteIMS",

        {

            id:id

        }


    );





    await refreshIMSCache();



    return result;



}









// ========================================
// BULK IMPORT IMS EXCEL
// ========================================


async function bulkAddIMSAPI(rows){



    const result =

    await safeRequest(

        "bulkIMS",

        rows

    );





    await refreshIMSCache();



    return result;



}








// ========================================
// REFRESH IMS
// ========================================


async function refreshIMSCache(){



    IMS_CACHE=[];



    return await getIMS(1);



}








// ========================================
// FIND IMS
// ========================================


function findIMS(reference_code){



    return IMS_CACHE.find(item=>


        String(item.reference_code)

        ===

        String(reference_code)


    );



}








console.log(
"API JS V3 OSS IMS READY"
);
// ========================================
// MASTER MONITORING V3
// OSS VS IMS VS DONE
// ========================================



// ========================================
// GET MASTER PAGE
// ========================================


async function getMasterAPI(page=1,search=""){


    const result = await safeRequest(

        "getMaster",

        {

            page:page,

            limit:LOAD_LIMIT,

            search:search

        }


    );



    if(result.success){


        MASTER_CACHE =
        result.data || [];


        return MASTER_CACHE;


    }



    return [];



}







// ========================================
// GET ALL MASTER
// khusus export
// ========================================


async function getAllMaster(){


    let page=1;

    let all=[];



    while(true){


        const result =
        await safeRequest(

            "getMaster",

            {

                page:page,

                limit:LOAD_LIMIT

            }


        );




        if(

            !result.success ||

            !result.data ||

            result.data.length===0

        ){

            break;

        }





        all.push(

            ...result.data

        );





        if(

            result.data.length < LOAD_LIMIT

        ){

            break;

        }




        page++;



    }





    MASTER_CACHE=all;


    return all;



}









// ========================================
// SEARCH MASTER
// ========================================


async function searchMasterAPI(keyword){



    const result =

    await safeRequest(

        "searchMaster",

        {

            keyword:keyword

        }


    );



    return result.success

    ?

    result.data

    :

    [];



}









// ========================================
// DASHBOARD
// ========================================


async function getDashboardAPI(){



    const result =

    await safeRequest(

        "dashboard",

        {}

    );



    if(result.success){


        return result.data;


    }



    return {


        totalOSS:0,

        totalIMS:0,

        totalDONE:0,

        sudah:0,

        progress:0,

        revisi:0,

        belumIMS:0


    };



}









// ========================================
// SYNC IMS KE DONE
// ========================================
// jika IMS selesai
// pindah ke sheet DONE
// ========================================


async function moveToDONEAPI(data){



    return await safeRequest(

        "moveDONE",

        {


            id:data.id,

            wo:data.wo,

            reference_code:data.reference_code,

            quotation:data.quotation,

            job_name:data.job_name,

            status:data.status,

            bulan:data.bulan


        }


    );



}









// ========================================
// CEK STATUS SELESAI
// ========================================


function isDoneStatus(status){


    let done=[


        "Approved",

        "Booked",

        "Closed",

        "Ready to Invoice",

        "Selesai"


    ];



    return done.includes(

        String(status)

    );



}









// ========================================
// UPDATE STATUS IMS
// AUTO DONE
// ========================================


async function updateIMSWithDone(data){



    const update =

    await updateIMSAPI(data);




    if(

        update.success &&

        isDoneStatus(data.status)

    ){


        await moveToDONEAPI(data);


    }



    return update;



}









// ========================================
// EXPORT EXCEL
// ========================================


async function exportExcelAPI(table){



    return await safeRequest(

        "exportExcel",

        {

            table:table

        }


    );


}









// ========================================
// REALTIME SYSTEM
// ========================================


let realtimeTimerV3=null;




function startRealtimeV3(
callback,
delay=60000
){



    stopRealtimeV3();



    realtimeTimerV3 =

    setInterval(async()=>{


        try{


            if(callback){


                await callback();


            }


        }


        catch(e){


            console.error(

                "REALTIME ERROR",

                e

            );


        }



    },delay);



}









function stopRealtimeV3(){



    if(realtimeTimerV3){


        clearInterval(

            realtimeTimerV3

        );


        realtimeTimerV3=null;


    }


}









// ========================================
// SYSTEM STATUS
// ========================================


function systemStatusV3(){



    return {


        OSS:

        OSS_CACHE.length,


        IMS:

        IMS_CACHE.length,


        MASTER:

        MASTER_CACHE.length,


        realtime:

        realtimeTimerV3!==null


    };


}









// ========================================
// CLEAR CACHE
// ========================================


function clearCacheV3(){



    OSS_CACHE=[];

    IMS_CACHE=[];

    MASTER_CACHE=[];



}









console.log(
"API JS V3 MASTER DONE READY"
);
