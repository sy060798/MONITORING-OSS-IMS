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
// GLOBAL REQUEST
// ========================================


async function apiRequest(action,data={}){


    try{


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

        "Tidak ada respon server"

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



        let result = 

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





        showToast(

        error.message,

        "error"

        );






        return {



            success:false,


            data:[]



        };



    }



}
// ========================================
// OSS API
// ========================================



// ========================================
// GET OSS
// ========================================


async function getOSS(){


    let result = await safeRequest(

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

            data.reference_code,



            cust_id:

            data.cust_id,



            customer:

            data.customer,



            city:

            data.city



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



            reference_code:

            data.reference_code,



            cust_id:

            data.cust_id,



            customer:

            data.customer,



            city:

            data.city



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
// IMPORT EXCEL
// ========================================


async function bulkAddOSSAPI(data){



    return await safeRequest(

        "bulkOSS",

        data


    );



}









// ========================================
// FORMAT OSS DATA
// ========================================


function formatOSS(data){



    return {


        reference_code:


        String(

            data.reference_code ||

            ""

        ).trim(),





        cust_id:


        String(

            data.cust_id ||

            ""

        ).trim(),





        customer:


        String(

            data.customer ||

            ""

        ).trim(),





        city:


        String(

            data.city ||

            ""

        ).trim()



    };



}









// ========================================
// VALIDATE OSS
// ========================================


function validateOSS(data){



    if(!data.reference_code){



        throw new Error(

        "Reference Code wajib diisi"

        );



    }






    if(!data.customer){



        throw new Error(

        "Customer wajib diisi"

        );



    }






    return true;



}









// ========================================
// SAVE OSS AUTO
// ========================================


async function saveOSSData(data){



    let cleanData =

    formatOSS(data);





    validateOSS(cleanData);






    if(cleanData.id){



        return await updateOSSAPI(

            cleanData

        );



    }






    else{



        return await addOSSAPI(

            cleanData

        );



    }



}

// ========================================
// IMS API
// ========================================





// ========================================
// GET IMS
// ========================================


async function getIMS(){



    let result = await safeRequest(


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

            data.wo,



            reference_code:

            data.reference_code,



            quotation:

            data.quotation,



            job_name:

            data.job_name,



            status:

            data.status || "Progress",



            bulan:

            data.bulan



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


            wo:

            data.wo,



            reference_code:

            data.reference_code,



            quotation:

            data.quotation,



            job_name:

            data.job_name,



            status:

            data.status,



            bulan:

            data.bulan



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
// IMPORT EXCEL
// ========================================


async function bulkAddIMSAPI(data){



    return await safeRequest(


        "bulkIMS",


        data


    );



}









// ========================================
// FORMAT IMS DATA
// ========================================


function formatIMS(data){



    return {



        wo:


        String(

            data.wo ||

            ""

        ).trim(),






        reference_code:


        String(

            data.reference_code ||

            ""

        ).trim(),






        quotation:


        String(

            data.quotation ||

            ""

        ).trim(),






        job_name:


        String(

            data.job_name ||

            ""

        ).trim(),






        status:


        data.status ||

        "Progress",






        bulan:


        String(

            data.bulan ||

            ""

        ).trim()




    };



}









// ========================================
// VALIDATE IMS
// ========================================


function validateIMS(data){



    if(!data.wo){



        throw new Error(

        "WO wajib diisi"

        );



    }






    if(!data.reference_code){



        throw new Error(

        "Reference Code wajib diisi"

        );



    }







    return true;



}









// ========================================
// SAVE IMS AUTO
// ========================================


async function saveIMSData(data){



    let cleanData =


    formatIMS(data);







    validateIMS(cleanData);








    return await addIMSAPI(

        cleanData

    );



}









// ========================================
// DELETE MULTIPLE IMS
// ========================================


async function deleteMultipleIMS(ids){



    let result=[];





    for(let id of ids){



        let response =


        await deleteIMSAPI(id);





        result.push(response);



    }





    return result;



}

// ========================================
// REALTIME SYNC HELPER
// ========================================



let apiRefreshTimer = null;







// ========================================
// START AUTO REFRESH
// ========================================


function startAPIAutoRefresh(callback,delay=30000){



    stopAPIAutoRefresh();





    apiRefreshTimer = setInterval(async()=>{



        try{



            if(callback){



                await callback();



            }



        }



        catch(error){



            console.error(

            "Realtime Error",

            error

            );



        }




    },delay);



}









// ========================================
// STOP AUTO REFRESH
// ========================================


function stopAPIAutoRefresh(){



    if(apiRefreshTimer){



        clearInterval(

            apiRefreshTimer

        );



        apiRefreshTimer=null;



    }



}









// ========================================
// TEST CONNECTION
// ========================================


async function testConnection(){



    try{



        let result =


        await safeRequest(

            "test"

        );





        if(result.success){



            console.log(

            "GOOGLE SHEET ONLINE"

            );



            return true;



        }





        return false;




    }



    catch(error){



        console.error(

        "Connection Failed",

        error

        );



        return false;



    }



}









// ========================================
// GET MASTER DATA
// OSS VS IMS
// ========================================


async function getMasterData(){



    let oss = await getOSS();



    let ims = await getIMS();





    let master=[];





    oss.forEach(itemOSS=>{



        let itemIMS = ims.find(item=>


            item.reference_code ===

            itemOSS.reference_code


        );






        let row={



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



            row.status =

            "🔴 Belum IMS";



            row.note =

            "Reference Code belum ada di IMS";



        }





        else{



            row.wo =

            itemIMS.wo;



            row.bulan =

            itemIMS.bulan;



            row.job_name =

            itemIMS.job_name;





            if(



                [

                    "Approved",

                    "Booked",

                    "Closed",

                    "Ready to Invoice"


                ]

                .includes(itemIMS.status)



            ){



                row.status =

                "🟢 Sudah";



            }






            else if(itemIMS.status==="Revisi"){



                row.status =

                "🟡 Revisi";



                row.note =

                "Perlu revisi";



            }





            else{



                row.status =

                "🔵 Progress";



            }



        }







        master.push(row);





    });








    return master;



}









// ========================================
// DATE FORMAT
// ========================================


function formatDate(date=new Date()){



    return date.toLocaleString(

        "id-ID",

        {


            day:"2-digit",


            month:"2-digit",


            year:"numeric",


            hour:"2-digit",


            minute:"2-digit"



        }


    );



}









// ========================================
// API STATUS
// ========================================


async function apiStatus(){



    let online =


    await testConnection();





    return {



        online:online,



        time:formatDate()



    };



}









// ========================================
// INITIAL CHECK
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{



    console.log(

    "API MODULE READY"

    );



});
