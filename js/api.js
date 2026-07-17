// ========================================
// OSS IMS MONITORING
// API CONNECTOR
// GOOGLE APPS SCRIPT
// VERSION SYNC
// ========================================


// ========================================
// CONFIG
// ========================================


const API_URL =

"https://script.google.com/macros/s/AKfycby__Lw6UXk4CezUKiTHIs0F-EXmEK3eaQfyBkfckdBjXGc5dOJxRwtZ_ILbg9h54ylb/exec";





// ========================================
// CORE REQUEST
// ========================================


async function apiRequest(action,data={}){


    try{


        console.log(

            "API REQUEST",

            {
                action:action,
                data:data
            }

        );





        const response = await fetch(API_URL,{


            method:"POST",


            headers:{


                "Content-Type":

                "application/json"


            },



            body:JSON.stringify({


                action:action,


                data:data


            })


        });






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

            "API REQUEST ERROR",

            error

        );



        throw error;



    }



}







// ========================================
// RESPONSE CHECK
// ========================================


function checkResponse(result){



    if(!result){


        throw new Error(

            "Tidak ada response dari server"

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





        return checkResponse(result);



    }


    catch(error){



        console.error(

            "API ERROR : "+action,

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


            data:[]


        };



    }



}









// ========================================
// TEST CONNECTION
// ========================================


async function testConnection(){


    try{


        const result =

        await apiRequest(

            "test",

            {}

        );






        console.log(

            "API ONLINE",

            result

        );



        return result;



    }


    catch(error){



        console.error(

            "API OFFLINE",

            error

        );



        return {


            success:false,


            message:error.message



        };


    }



}








console.log(

"API MODULE READY"

);

// ========================================
// OSS MODULE
// CRUD OSS
// ========================================



// ========================================
// GET OSS
// ========================================


async function getOSS(){


    const result =

    await safeRequest(

        "getOSS",

        {}

    );





    return result.data || [];



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
// BULK OSS
// EXCEL IMPORT
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
// OSS CACHE
// ========================================


let OSS_CACHE=[];








async function loadOSSCache(){



    OSS_CACHE =

    await getOSS();




    return OSS_CACHE;



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
// REFRESH OSS CACHE
// ========================================


async function refreshOSSCache(){



    OSS_CACHE=[];



    return await loadOSSCache();



}

// ========================================
// IMS MODULE
// CRUD IMS
// ========================================



// ========================================
// GET IMS
// ========================================


async function getIMS(){


    const result =

    await safeRequest(

        "getIMS",

        {}

    );





    return result.data || [];



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
// BULK IMS
// EXCEL IMPORT
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
// IMS CACHE
// ========================================


let IMS_CACHE=[];








async function loadIMSCache(){



    IMS_CACHE =

    await getIMS();




    return IMS_CACHE;



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



    return await loadIMSCache();



}








// ========================================
// REALTIME IMS
// ========================================


async function realtimeIMS(){



    return await getIMS();



}

// ========================================
// MASTER MONITORING
// OSS VS IMS
// ========================================


let MASTER_CACHE=[];






// ========================================
// GET MASTER DATA
// ========================================


async function getMasterData(){


    const oss =

    await getOSS();





    const ims =

    await getIMS();





    let master=[];






    oss.forEach(itemOSS=>{



        let itemIMS =

        ims.find(item=>



            String(item.reference_code)

            ===

            String(itemOSS.reference_code)



        );







        let data={



            id:

            itemOSS.id || "",



            wo:"-",



            reference_code:

            itemOSS.reference_code || "",



            customer:

            itemOSS.customer || "",



            city:

            itemOSS.city || "",



            quotation:"-",



            job_name:"-",



            bulan:"-",



            status:"",



            note:""

        };









        if(!itemIMS){



            data.status =

            "🔴 Belum IMS";



            data.note =

            "Reference Code belum masuk IMS";



        }



        else{



            data.wo =

            itemIMS.wo || "-";



            data.quotation =

            itemIMS.quotation || "-";



            data.job_name =

            itemIMS.job_name || "-";



            data.bulan =

            itemIMS.bulan || "-";







            if(



                itemIMS.status==="Approved"



                ||



                itemIMS.status==="Booked"



                ||



                itemIMS.status==="Closed"



                ||



                itemIMS.status==="Ready to Invoice"



            ){



                data.status =

                "🟢 Sudah";



            }



            else if(



                itemIMS.status==="Revisi"



            ){



                data.status =

                "🟡 Revisi";



                data.note =

                "Perlu revisi";



            }



            else{



                data.status =

                "🔵 Progress";



            }



        }







        master.push(data);



    });







    MASTER_CACHE = master;



    return MASTER_CACHE;



}








// ========================================
// DASHBOARD
// ========================================


async function getDashboard(){



    const master =

    await getMasterData();





    let result={



        totalOSS:

        master.length,



        totalIMS:

        0,



        belumIMS:

        0,



        progress:

        0,



        selesai:

        0,



        revisi:

        0



    };







    master.forEach(item=>{



        if(

            item.status.includes("Belum")

        ){



            result.belumIMS++;



        }



        else if(



            item.status.includes("Progress")

        ){



            result.progress++;



            result.totalIMS++;



        }



        else if(



            item.status.includes("Sudah")

        ){



            result.selesai++;



            result.totalIMS++;



        }



        else if(



            item.status.includes("Revisi")

        ){



            result.revisi++;



            result.totalIMS++;



        }



    });






    return result;



}








// ========================================
// REALTIME AUTO REFRESH
// ========================================


let realtimeTimer=null;








function startRealtime(callback,delay=30000){



    stopRealtime();






    realtimeTimer =

    setInterval(async()=>{



        if(callback){



            await callback();



        }



    },delay);



}








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


async function refreshAll(){



    OSS_CACHE=[];



    IMS_CACHE=[];



    MASTER_CACHE=[];







    await loadOSSCache();



    await loadIMSCache();







    return await getMasterData();



}








// ========================================
// SYSTEM READY
// ========================================


console.log(

"API FULL MODULE READY"

);
