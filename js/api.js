// ========================================
// OSS IMS MONITORING
// API CONNECTOR V2
// BIG DATA SYNC VERSION
// ========================================


// ========================================
// CONFIG
// ========================================


const API_URL =

"https://script.google.com/macros/s/AKfycby__Lw6UXk4CezUKiTHIs0F-EXmEK3eaQfyBkfckdBjXGc5dOJxRwtZ_ILbg9h54ylb/exec";




// ========================================
// GLOBAL CACHE
// ========================================


let OSS_CACHE = [];

let IMS_CACHE = [];

let MASTER_CACHE = [];




// ========================================
// LOAD CONFIG
// ========================================


// jumlah data per load
// aman untuk 50k - 1 juta data


const LOAD_LIMIT = 500;




// ========================================
// CORE REQUEST
// ========================================


async function apiRequest(action,data={}){


    try{


        console.log(

            "API REQUEST",

            {
                action,
                data
            }

        );




        const response = await fetch(

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





        const result =

        await response.json();





        console.log(

            "API RESPONSE",

            result

        );





        return result;



    }



    catch(error){


        console.error(

            "API ERROR",

            error

        );


        throw error;



    }



}








// ========================================
// SAFE REQUEST
// ========================================


async function safeRequest(action,data={}){


    try{


        const result =

        await apiRequest(

            action,

            data

        );





        if(!result){


            throw new Error(

                "Server kosong"

            );


        }





        if(result.success===false){


            throw new Error(

                result.message ||

                "Request gagal"

            );


        }





        return result;



    }



    catch(error){



        console.error(

            "SAFE ERROR",

            action,

            error

        );





        if(typeof showToast==="function"){


            showToast(

                error.message,

                "error"

            );


        }





        return {


            success:false,


            data:[],


            message:error.message


        };



    }



}








// ========================================
// TEST CONNECTION
// ========================================


async function testConnection(){



    try{


        return await apiRequest(

            "test",

            {}

        );



    }


    catch(error){



        return {


            success:false,


            message:error.message


        };



    }


}








// ========================================
// BIG DATA REQUEST
// ========================================
// dipakai untuk data besar
// contoh:
// getOSS({page:1})
// ========================================


async function bigDataRequest(action,page=1){



    return await safeRequest(

        action,

        {


            page:page,


            limit:LOAD_LIMIT



        }


    );



}







console.log(

"API CORE V2 READY"

);

// ========================================
// OSS MODULE V2
// BIG DATA READY
// ========================================



// ========================================
// GET OSS
// ========================================
// hanya ambil data aktif
// pagination support
// ========================================


async function getOSS(page=1){



    const result = await bigDataRequest(

        "getOSS",

        page

    );



    if(result.success){



        OSS_CACHE = result.data || [];



        return OSS_CACHE;



    }



    return [];



}







// ========================================
// GET ALL OSS
// optional refresh
// ========================================


async function getAllOSS(){



    let page = 1;

    let all = [];



    while(true){



        let result = await bigDataRequest(

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





    OSS_CACHE = all;



    return all;



}







// ========================================
// ADD OSS
// ========================================


async function addOSSAPI(data){



    return await safeRequest(

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



}








// ========================================
// UPDATE OSS
// ========================================


async function updateOSSAPI(data){



    return await safeRequest(

        "updateOSS",

        {


            id:

            data.id || "",



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



}








// ========================================
// DELETE OSS
// ========================================


async function deleteOSSAPI(id){



    return await safeRequest(

        "deleteOSS",

        {


            id:id


        }


    );



}








// ========================================
// BULK OSS EXCEL
// ========================================


async function bulkAddOSSAPI(data){



    return await safeRequest(

        "bulkOSS",

        data


    );



}








// ========================================
// FORMAT OSS
// ========================================


function formatOSS(data){



    return {


        id:

        data.id || "",



        reference_code:

        data.reference_code || "",



        cust_id:

        data.cust_id || "",



        customer:

        data.customer || "",



        city:

        data.city || ""



    };



}








// ========================================
// FIND OSS CACHE
// ========================================


function findOSS(reference_code){



    return OSS_CACHE.find(item=>



        String(item.reference_code)

        ===

        String(reference_code)



    );



}








// ========================================
// REFRESH OSS
// ========================================


async function refreshOSSCache(){



    OSS_CACHE=[];



    return await getOSS();



}

// ========================================
// IMS MODULE V2
// BIG DATA READY
// ========================================





// ========================================
// GET IMS
// ========================================


async function getIMS(page=1){



    const result = await bigDataRequest(

        "getIMS",

        page

    );



    if(result.success){



        IMS_CACHE = result.data || [];



        return IMS_CACHE;



    }



    return [];



}








// ========================================
// GET ALL IMS
// ========================================


async function getAllIMS(){



    let page = 1;

    let all = [];





    while(true){



        let result = await bigDataRequest(

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





    IMS_CACHE = all;



    return all;



}








// ========================================
// ADD IMS
// ========================================


async function addIMSAPI(data){



    return await safeRequest(

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



}








// ========================================
// UPDATE IMS
// ========================================


async function updateIMSAPI(data){



    return await safeRequest(

        "updateIMS",

        {



            id:

            data.id || "",



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



}








// ========================================
// DELETE IMS
// ========================================


async function deleteIMSAPI(id){



    return await safeRequest(

        "deleteIMS",

        {



            id:id



        }


    );



}








// ========================================
// BULK IMS EXCEL
// ========================================


async function bulkAddIMSAPI(data){



    return await safeRequest(

        "bulkIMS",

        data


    );



}








// ========================================
// FORMAT IMS
// ========================================


function formatIMS(data){



    return {



        id:

        data.id || "",



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



    };



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








// ========================================
// REFRESH IMS CACHE
// ========================================


async function refreshIMSCache(){



    IMS_CACHE=[];



    return await getIMS();



}








// ========================================
// REALTIME IMS
// ========================================


async function realtimeIMS(){



    return await getIMS();



}

// ========================================
// MASTER MONITORING V2
// LIGHT LOAD VERSION
// ========================================



let MASTER_CACHE=[];





// ========================================
// GET MASTER DATA
// ========================================


async function getMasterData(){



    const result = await safeRequest(

        "getMaster",

        {


            limit:LOAD_LIMIT


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
// FIND MASTER
// ========================================


function findMaster(reference_code){



    return MASTER_CACHE.find(item=>



        String(item.reference_code)

        ===

        String(reference_code)



    );



}








// ========================================
// DASHBOARD
// ========================================
// ambil summary saja
// tidak tarik data besar
// ========================================


async function getDashboard(){



    const result = await safeRequest(

        "getDashboard",

        {}

    );





    if(result.success){



        return result.data;



    }





    return {



        totalOSS:0,



        totalIMS:0,



        belumIMS:0,



        progress:0,



        selesai:0,



        revisi:0



    };



}








// ========================================
// SUMMARY STATUS
// ========================================


function countStatus(data){



    let result={



        sudah:0,

        progress:0,

        revisi:0,

        belum:0



    };





    data.forEach(item=>{



        if(

            String(item.status)

            .includes("Sudah")

        ){



            result.sudah++;



        }



        else if(

            String(item.status)

            .includes("Progress")

        ){



            result.progress++;



        }



        else if(

            String(item.status)

            .includes("Revisi")

        ){



            result.revisi++;



        }



        else if(

            String(item.status)

            .includes("Belum")

        ){



            result.belum++;



        }



    });





    return result;



}








// ========================================
// REFRESH MASTER
// ========================================


async function refreshMaster(){



    MASTER_CACHE=[];



    return await getMasterData();



}








// ========================================
// SEARCH CACHE
// ========================================


function searchMaster(keyword){



    keyword =

    String(keyword)

    .toLowerCase();





    return MASTER_CACHE.filter(item=>{



        return (



            String(item.reference_code)

            .toLowerCase()

            .includes(keyword)



            ||



            String(item.customer)

            .toLowerCase()

            .includes(keyword)



            ||



            String(item.city)

            .toLowerCase()

            .includes(keyword)



        );



    });



}

// ========================================
// FINAL SYNC ENGINE V2
// OSS IMS MONITORING
// ========================================





// ========================================
// REALTIME TIMER
// ========================================


let realtimeTimer = null;








// ========================================
// START REALTIME
// ========================================
// default 30 detik
// ========================================


function startRealtime(callback,delay=30000){



    stopRealtime();





    realtimeTimer = setInterval(async()=>{



        try{



            if(callback){



                await callback();



            }



        }



        catch(error){



            console.error(

                "REALTIME ERROR",

                error

            );



        }





    },delay);



}








// ========================================
// STOP REALTIME
// ========================================


function stopRealtime(){



    if(realtimeTimer){



        clearInterval(

            realtimeTimer

        );



        realtimeTimer=null;



    }



}








// ========================================
// REFRESH ALL DATA
// ========================================
// ringan
// tidak tarik done
// ========================================


async function refreshAll(){



    try{



        OSS_CACHE=[];

        IMS_CACHE=[];

        MASTER_CACHE=[];





        await refreshOSSCache();



        await refreshIMSCache();





        return await refreshMaster();



    }



    catch(error){



        console.error(

            "REFRESH ALL ERROR",

            error

        );



        return [];



    }



}








// ========================================
// LOAD INITIAL SYSTEM
// ========================================


async function initSystem(){



    console.log(

        "SYSTEM INITIAL LOAD"

    );





    let result = await refreshAll();





    console.log(

        "SYSTEM READY",

        result.length,

        "DATA"

    );





    return result;



}








// ========================================
// API HEALTH CHECK
// ========================================


async function apiHealthCheck(){



    try{



        const result = await safeRequest(

            "test",

            {}

        );





        return result;



    }



    catch(error){



        return {



            success:false,

            message:error.message



        };



    }



}








// ========================================
// CLEAR LOCAL CACHE
// ========================================


function clearLocalCache(){



    OSS_CACHE=[];



    IMS_CACHE=[];



    MASTER_CACHE=[];



    console.log(

        "CACHE CLEARED"

    );



}








// ========================================
// PAGINATION HELPER
// ========================================


function paginate(array,page=1,limit=100){



    let start =

    (page-1)*limit;





    return array.slice(

        start,

        start+limit

    );



}








// ========================================
// SYSTEM STATUS
// ========================================


function systemStatus(){



    return {



        OSS:

        OSS_CACHE.length,



        IMS:

        IMS_CACHE.length,



        MASTER:

        MASTER_CACHE.length,



        realtime:

        realtimeTimer !== null



    };



}








// ========================================
// FINAL READY
// ========================================


console.log(

"API FULL MODULE V2 READY"

);

// ========================================
// COMPATIBILITY PATCH
// OSS IMS OLD MODULE SUPPORT
// ========================================



// ========================================
// MASTER COMPATIBILITY
// ========================================


async function getMasterAPI(){


    return await getMasterData();


}





// ========================================
// DASHBOARD COMPATIBILITY
// ========================================


async function getDashboardAPI(){


    return await getDashboard();


}





// ========================================
// API SUCCESS HELPER
// ========================================


function apiSuccess(result){


    return (

        result &&

        result.success === true

    );


}





// ========================================
// API MESSAGE HELPER
// ========================================


function apiMessage(result){


    if(!result){


        return "Response kosong";


    }


    return result.message || "";



}





// ========================================
// REFRESH COMPATIBILITY
// ========================================


async function refreshAPI(){


    return await refreshAll();


}





// ========================================
// FINAL CONNECTOR
// ========================================


console.log(

"API COMPATIBILITY PATCH ACTIVE"

);
