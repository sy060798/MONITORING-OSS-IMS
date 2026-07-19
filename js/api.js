// ========================================
// OSS IMS MONITORING
// API JS V3 FINAL
// CONNECT APPS SCRIPT V3
// ========================================


// ========================================
// CONFIG
// ========================================

const API_URL =

"https://script.google.com/macros/s/AKfycby__Lw6UXk4CezUKiTHIs0F-EXmEK3eaQfyBkfckdBjXGc5dOJxRwtZ_ILbg9h54ylb/exec";





// ========================================
// CACHE
// ========================================

let OSS_CACHE=[];

let IMS_CACHE=[];

let MASTER_CACHE=[];

let DONE_CACHE=[];



const PAGE_LIMIT=100;







// ========================================
// CORE REQUEST
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



    }



    return result;



}







// ========================================
// TEST
// ========================================

async function testConnection(){


    return await safeRequest(

        "test",

        {}

    );


}








// ========================================
// PAGING
// ========================================

async function loadPage(action,page=1){


    return await safeRequest(

        action,

        {

            page:page,

            limit:PAGE_LIMIT

        }


    );


}









// ========================================
// OSS GET
// ========================================

async function getOSS(page=1){



    const result =

    await loadPage(

        "getOSS",

        page

    );



    if(result.success){


        OSS_CACHE =

        result.data || [];



    }



    return OSS_CACHE;


}









// ========================================
// OSS ADD
// ========================================

async function addOSSAPI(data){


    const result =

    await safeRequest(

        "addOSS",

        data

    );



    if(result.success){


        await getOSS(1);


    }



    return result;



}









// ========================================
// OSS UPDATE
// ========================================

async function updateOSSAPI(data){



    const result =

    await safeRequest(

        "updateOSS",

        data

    );



    if(result.success){


        await getOSS(1);


    }



    return result;



}








// ========================================
// OSS DELETE
// ========================================

async function deleteOSSAPI(id){



    const result =

    await safeRequest(

        "deleteOSS",

        {

            id:id

        }


    );



    if(result.success){


        await getOSS(1);


    }



    return result;



}









// ========================================
// OSS BULK EXCEL
// ========================================

async function bulkAddOSSAPI(rows){



    const result =

    await safeRequest(

        "bulkOSS",

        rows

    );



    if(result.success){


        await getOSS(1);


    }



    return result;


}
// ========================================
// MASTER MONITORING JS V3
// BIG DATA READY
// ========================================


let MASTER_CACHE = [];

let MASTER_PAGE = 1;

const MASTER_LIMIT = 100;





// ========================================
// GET MASTER
// ========================================


async function getMasterAPI(){


    const result = await safeRequest(

        "getMaster",

        {

            page:MASTER_PAGE,

            limit:MASTER_LIMIT

        }

    );



    if(result.success){


        MASTER_CACHE = result.data || [];


        return MASTER_CACHE;


    }



    return [];

}





// ========================================
// LOAD MASTER TABLE
// ========================================


async function loadMaster(){


    const data = await getMasterAPI();


    renderMaster(data);


    updateMasterCard(data);



}





// ========================================
// RENDER MASTER
// ========================================


function renderMaster(data){


    let html="";



    data.forEach(item=>{


        html += `

        <tr>

        <td>${item.wo || "-"}</td>

        <td>${item.reference_code || ""}</td>

        <td>${item.customer || ""}</td>

        <td>${item.city || ""}</td>

        <td>${item.bulan || "-"}</td>

        <td>${item.job_name || "-"}</td>

        <td>${masterBadge(item.status)}</td>

        <td>${item.note || "-"}</td>


        </tr>


        `;


    });





    const el =

    document.getElementById(

        "masterData"

    );




    if(el)

    el.innerHTML = html;



}





// ========================================
// STATUS BADGE
// ========================================


function masterBadge(status){



    let cls="";



    if(status.includes("Sudah"))

    cls="status-sudah";



    else if(status.includes("Revisi"))

    cls="status-revisi";



    else if(status.includes("Belum"))

    cls="status-belum";



    else

    cls="status-progress";





    return `

    <span class="badge ${cls}">

    ${status}

    </span>

    `;


}







// ========================================
// DASHBOARD
// ========================================


async function loadDashboard(){



    const result = await safeRequest(

        "getDashboard",

        {}

    );




    if(!result.success)

    return;





    let d=result.data;



    setText(

        "totalOSS",

        d.totalOSS

    );



    setText(

        "totalIMS",

        d.totalIMS

    );



    setText(

        "totalDONE",

        d.totalDONE

    );



    setText(

        "belumIMS",

        d.belumIMS

    );



    setText(

        "progress",

        d.progress

    );



    setText(

        "revisi",

        d.revisi

    );



    setText(

        "selesai",

        d.selesai

    );




}






function setText(id,value){


    let el=document.getElementById(id);


    if(el)

    el.innerText=value;


}








// ========================================
// DONE MODULE
// ========================================


async function getDONEAPI(){



    const result = await safeRequest(

        "getDONE",

        {

            page:1,

            limit:100

        }

    );



    if(result.success)

    return result.data;



    return [];



}







async function syncDONEAPI(){



    const result = await safeRequest(

        "syncDONE",

        {}

    );




    if(result.success){



        showToast(

            result.message,

            "success"

        );


    }




    return result;



}







// ========================================
// SEARCH MASTER
// ========================================


function searchMasterData(keyword){



    keyword =

    keyword.toLowerCase();




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
// REFRESH SYSTEM
// ========================================


async function refreshSystem(){



    await loadDashboard();


    await loadMaster();



}








// ========================================
// REALTIME
// ========================================


let masterRealtime=null;



function startMasterRealtime(){



    stopMasterRealtime();




    masterRealtime = setInterval(()=>{


        refreshSystem();



    },60000);



}







function stopMasterRealtime(){



    if(masterRealtime){


        clearInterval(masterRealtime);


        masterRealtime=null;


    }


}








// ========================================
// INIT
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadDashboard();


    loadMaster();


    startMasterRealtime();


}

);

// ========================================
// API JS V3 PART 3A
// UI CONTROLLER
// OSS IMS FORM CRUD
// ========================================


// ========================================
// GLOBAL EDIT MODE
// ========================================


let EDIT_MODE = null;

let EDIT_ID = null;






// ========================================
// OPEN OSS FORM
// ========================================


function openOSSForm(data={}){


    EDIT_MODE="OSS";


    EDIT_ID=data.id || null;



    setValue(

        "oss_reference",

        data.reference_code || ""

    );


    setValue(

        "oss_cust",

        data.cust_id || ""

    );


    setValue(

        "oss_customer",

        data.customer || ""

    );


    setValue(

        "oss_city",

        data.city || ""

    );



    showModal("ossModal");


}







// ========================================
// SAVE OSS
// ========================================


async function saveOSS(){


    let data={


        id:EDIT_ID,


        reference_code:getValue("oss_reference"),


        cust_id:getValue("oss_cust"),


        customer:getValue("oss_customer"),


        city:getValue("oss_city")


    };




    let result;



    if(EDIT_MODE==="OSS" && EDIT_ID){



        result = await updateOSSAPI(data);



    }

    else{



        result = await addOSSAPI(data);



    }





    if(result.success!==false){



        closeModal("ossModal");


        await loadMaster();


        showToast(

            "OSS tersimpan",

            "success"

        );


    }



}









// ========================================
// OPEN IMS FORM
// ========================================


function openIMSForm(data={}){


    EDIT_MODE="IMS";


    EDIT_ID=data.id || null;




    setValue(

        "ims_wo",

        data.wo || ""

    );


    setValue(

        "ims_reference",

        data.reference_code || ""

    );



    setValue(

        "ims_quotation",

        data.quotation || ""

    );



    setValue(

        "ims_job",

        data.job_name || ""

    );



    setValue(

        "ims_status",

        data.status || "Progress"

    );



    setValue(

        "ims_bulan",

        data.bulan || ""

    );



    showModal("imsModal");


}









// ========================================
// SAVE IMS
// ========================================


async function saveIMS(){



    let data={



        id:EDIT_ID,


        wo:getValue("ims_wo"),


        reference_code:getValue("ims_reference"),


        quotation:getValue("ims_quotation"),


        job_name:getValue("ims_job"),


        status:getValue("ims_status"),


        bulan:getValue("ims_bulan")



    };





    let result;




    if(

        EDIT_MODE==="IMS"

        &&

        EDIT_ID

    ){



        result = await updateIMSAPI(data);



    }

    else{



        result = await addIMSAPI(data);



    }






    if(result.success!==false){



        closeModal("imsModal");



        await loadMaster();



        showToast(

            "IMS tersimpan",

            "success"

        );


    }




}








// ========================================
// DELETE OSS
// ========================================


async function removeOSS(id){



    if(!confirm("Hapus OSS?"))

    return;



    const result =

    await deleteOSSAPI(id);





    if(result.success!==false){



        await loadMaster();



        showToast(

            "OSS dihapus",

            "success"

        );


    }


}









// ========================================
// DELETE IMS
// ========================================


async function removeIMS(id){



    if(!confirm("Hapus IMS?"))

    return;



    const result =

    await deleteIMSAPI(id);






    if(result.success!==false){



        await loadMaster();



        showToast(

            "IMS dihapus",

            "success"

        );


    }



}








// ========================================
// MODAL HELPER
// ========================================


function showModal(id){


    let el=document.getElementById(id);


    if(el)

    el.style.display="block";


}





function closeModal(id){


    let el=document.getElementById(id);


    if(el)

    el.style.display="none";


}








// ========================================
// INPUT HELPER
// ========================================


function getValue(id){


    let el=document.getElementById(id);


    return el ? el.value : "";

}





function setValue(id,value){


    let el=document.getElementById(id);


    if(el)

    el.value=value;


}





// ========================================
// TOAST
// ========================================


function showToast(message,type="success"){



    let el=document.getElementById("toast");



    if(!el)

    return;



    el.innerHTML=message;



    el.className=

    "toast "+type;



    el.style.display="block";





    setTimeout(()=>{


        el.style.display="none";


    },3000);



}
// ========================================
// API JS V3 PART 3B
// EXCEL + PAGINATION + FILTER + SYNC
// ========================================


// ========================================
// EXCEL EXPORT MASTER
// ========================================


function exportMasterExcel(){



    if(typeof XLSX==="undefined"){



        showToast(

            "Library Excel belum aktif",

            "error"

        );


        return;


    }






    let data = MASTER_CACHE.map(item=>({



        WO:item.wo || "-",


        Reference_Code:item.reference_code || "",


        Customer:item.customer || "",


        City:item.city || "",


        Bulan:item.bulan || "-",


        Job_Name:item.job_name || "-",


        Status:item.status || "",


        Note:item.note || ""



    }));







    let ws = XLSX.utils.json_to_sheet(data);



    let wb = XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "MASTER"

    );




    XLSX.writeFile(

        wb,

        "MASTER_MONITORING.xlsx"

    );



}








// ========================================
// IMPORT EXCEL OSS
// ========================================


function importOSSExcel(file){



    let reader=new FileReader();





    reader.onload=function(e){



        let data =

        new Uint8Array(

            e.target.result

        );





        let workbook =

        XLSX.read(

            data,

            {

                type:"array"

            }

        );





        let sheet =

        workbook.Sheets[

            workbook.SheetNames[0]

        ];





        let rows =

        XLSX.utils.sheet_to_json(

            sheet

        );





        bulkAddOSSAPI(rows)

        .then(()=>{



            loadMaster();



            showToast(

                "Import OSS selesai",

                "success"

            );



        });



    };





    reader.readAsArrayBuffer(file);



}









// ========================================
// IMPORT EXCEL IMS
// ========================================


function importIMSExcel(file){



    let reader=new FileReader();





    reader.onload=function(e){



        let data =

        new Uint8Array(

            e.target.result

        );





        let workbook =

        XLSX.read(

            data,

            {

                type:"array"

            }

        );





        let sheet =

        workbook.Sheets[

            workbook.SheetNames[0]

        ];





        let rows =

        XLSX.utils.sheet_to_json(

            sheet

        );





        bulkAddIMSAPI(rows)

        .then(()=>{



            loadMaster();



            showToast(

                "Import IMS selesai",

                "success"

            );



        });



    };





    reader.readAsArrayBuffer(file);



}









// ========================================
// MASTER PAGINATION
// ========================================


function nextMaster(){



    MASTER_PAGE++;



    loadMaster();



}





function prevMaster(){



    if(MASTER_PAGE>1){



        MASTER_PAGE--;



        loadMaster();



    }



}









// ========================================
// FILTER MASTER
// ========================================


function filterMaster(){



    let keyword =

    getValue(

        "searchMaster"

    )

    .toLowerCase();





    let result =

    MASTER_CACHE.filter(item=>{





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



            ||



            String(item.job_name)

            .toLowerCase()

            .includes(keyword)



        );




    });







    renderMaster(result);



}









// ========================================
// SYNC DONE BUTTON
// ========================================


async function runSyncDONE(){



    const result =

    await syncDONEAPI();





    if(result.success!==false){



        await loadDashboard();



        await loadMaster();



    }



}









// ========================================
// LOADING
// ========================================


function setLoading(status){



    let el =

    document.getElementById(

        "loading"

    );




    if(!el)

    return;






    if(status){



        el.innerHTML=

        "Loading...";



    }

    else{



        el.innerHTML=

        "Ready";



    }



}









// ========================================
// SAFE REFRESH
// ========================================


async function safeRefresh(){



    try{



        setLoading(true);



        await refreshSystem();



    }

    catch(e){



        console.error(e);



        showToast(

            "Gagal refresh",

            "error"

        );



    }

    finally{



        setLoading(false);



    }



}









// ========================================
// FINAL INIT CONTROLLER
// ========================================


window.addEventListener(

"beforeunload",

()=>{


    stopMasterRealtime();


}

);
// ========================================
// API JS V3 PART 4
// FINAL SYSTEM INTEGRATION
// OSS IMS MONITORING
// ========================================


// ========================================
// GLOBAL SYSTEM STATE
// ========================================


let SYSTEM_READY = false;

let AUTO_REFRESH_TIMER = null;







// ========================================
// FINAL INITIALIZE
// ========================================


async function initSystem(){



    try{



        setLoading(true);



        await loadDashboard();



        await loadMaster();



        SYSTEM_READY = true;



        startAutoRefresh();



        showToast(

            "System Ready",

            "success"

        );



    }

    catch(error){



        console.error(

            "INIT ERROR",

            error

        );



        showToast(

            "System gagal load",

            "error"

        );



    }

    finally{


        setLoading(false);


    }



}









// ========================================
// AUTO REFRESH SYSTEM
// ========================================


function startAutoRefresh(){



    stopAutoRefresh();




    AUTO_REFRESH_TIMER = setInterval(async()=>{



        try{



            await loadDashboard();



            await loadMaster();



        }

        catch(e){



            console.error(

                "AUTO REFRESH ERROR",

                e

            );


        }



    },60000);



}








function stopAutoRefresh(){



    if(AUTO_REFRESH_TIMER){



        clearInterval(

            AUTO_REFRESH_TIMER

        );



        AUTO_REFRESH_TIMER=null;



    }



}









// ========================================
// CHECK CONNECTION
// ========================================


async function checkAPI(){



    const result =

    await testConnection();




    if(result.success!==false){



        showToast(

            "API CONNECTED",

            "success"

        );



    }

    else{



        showToast(

            "API ERROR",

            "error"

        );



    }



    return result;



}









// ========================================
// LOAD BIG DATA MODE
// ========================================


async function loadBigData(type){



    let result=[];




    if(type==="OSS"){



        result=

        await getAllOSS();



    }



    if(type==="IMS"){



        result=

        await getAllIMS();



    }





    return result;



}









// ========================================
// CLEAR CACHE
// ========================================


function clearSystemCache(){



    OSS_CACHE=[];


    IMS_CACHE=[];


    MASTER_CACHE=[];



    console.log(

        "CACHE CLEAR"

    );



}









// ========================================
// DELETE ALL CONFIRM
// ========================================


function confirmDelete(id,type){



    if(type==="OSS"){



        removeOSS(id);



    }



    if(type==="IMS"){



        removeIMS(id);



    }



}









// ========================================
// STATUS SUMMARY
// ========================================


function getStatusSummary(){



    let result={



        sudah:0,


        progress:0,


        revisi:0,


        belum:0



    };






    MASTER_CACHE.forEach(item=>{



        let s=

        item.status || "";





        if(s.includes("Sudah"))



        result.sudah++;




        else if(s.includes("Progress"))



        result.progress++;




        else if(s.includes("Revisi"))



        result.revisi++;




        else if(s.includes("Belum"))



        result.belum++;





    });





    return result;



}









// ========================================
// EXPORT ALL DATA
// ========================================


async function exportAllExcel(){



    let data =

    await loadBigData(

        "OSS"

    );




    let ims =

    await loadBigData(

        "IMS"

    );





    let wb =

    XLSX.utils.book_new();





    let ws1 =

    XLSX.utils.json_to_sheet(

        data

    );





    let ws2 =

    XLSX.utils.json_to_sheet(

        ims

    );







    XLSX.utils.book_append_sheet(

        wb,

        ws1,

        "OSS"

    );





    XLSX.utils.book_append_sheet(

        wb,

        ws2,

        "IMS"

    );





    XLSX.writeFile(

        wb,

        "OSS_IMS_BACKUP.xlsx"

    );



}









// ========================================
// ERROR HANDLER GLOBAL
// ========================================


window.onerror=function(



message,

source,

line

){



    console.error(

        "SYSTEM ERROR",

        message,

        line

    );



};









// ========================================
// START FINAL
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    initSystem();


});
