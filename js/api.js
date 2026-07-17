// ========================================
// OSS IMS MONITORING
// API CONNECTOR
// GOOGLE APPS SCRIPT
// ========================================



// ========================================
// CONFIG
// ========================================


const API_URL =

"https://script.google.com/macros/s/AKfycbyKU9D3cIvJaR9Y7Tj7vOsMSHmF7ND_rFpXGHs76A2dyOGWFQ2a4l4qUWA-rOojxxgR/exec";




// ========================================
// CORE REQUEST
// ========================================


async function apiRequest(action,data={}){


    try{


        const response = await fetch(API_URL,{


            method:"POST",


            body:JSON.stringify({


                action:action,


                data:data


            })


        });





        const result =

        await response.json();





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
// RESPONSE CHECK
// ========================================


function checkResponse(result){



    if(!result){


        throw new Error(

        "Server tidak memberikan respon"

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

        "test"

        );





        console.log(

        "API ONLINE",

        result

        );



        return true;



    }


    catch(error){



        console.error(

        "API OFFLINE",

        error

        );



        return false;



    }


}







console.log(

"API MODULE READY"

);
// ========================================
// OSS MODULE
// ========================================



// ========================================
// GET OSS
// ========================================


async function getOSS(){



    const result =

    await safeRequest(

        "getOSS"

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

        data


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
// EXCEL UPLOAD
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
// CACHE READY
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



        item.reference_code ===

        reference_code



    );



}

// ========================================
// IMS MODULE
// ========================================



// ========================================
// GET IMS
// ========================================


async function getIMS(){



    const result =

    await safeRequest(

        "getIMS"

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

        data


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
// EXCEL UPLOAD
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



        item.reference_code ===

        reference_code



    );



}









// ========================================
// REALTIME IMS
// ========================================


async function realtimeIMS(){



    return await getIMS();



}

// ========================================
// MASTER MONITORING MODULE
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


            item.reference_code ===

            itemOSS.reference_code



        );








        let data={




            id:

            itemOSS.id || "",




            wo:"-",





            reference_code:

            itemOSS.reference_code,





            customer:

            itemOSS.customer,





            city:

            itemOSS.city,





            bulan:"-",





            job_name:"-",





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



            data.bulan =

            itemIMS.bulan || "-";



            data.job_name =

            itemIMS.job_name || "-";






            if(



                itemIMS.status==="Approved" ||


                itemIMS.status==="Booked" ||


                itemIMS.status==="Closed" ||


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



    return master;



}









// ========================================
// DASHBOARD SUMMARY
// ========================================


async function getDashboard(){



    const master =

    await getMasterData();





    let result={



        totalOSS:

        master.length,



        totalIMS:

        master.filter(item=>

            item.status !==

            "🔴 Belum IMS"


        ).length,



        totalMaster:

        master.length,



        status:{



            sudah:0,



            progress:0,



            revisi:0,



            belum:0



        }



    };







    master.forEach(item=>{





        if(item.status.includes("Sudah")){


            result.status.sudah++;


        }



        else if(item.status.includes("Progress")){


            result.status.progress++;


        }



        else if(item.status.includes("Revisi")){


            result.status.revisi++;


        }



        else if(item.status.includes("Belum")){


            result.status.belum++;


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
// API READY
// ========================================


console.log(

"API FULL MODULE READY"

);
