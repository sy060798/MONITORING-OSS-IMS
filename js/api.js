// ========================================
// OSS IMS MONITORING
// API JS V3 FINAL CLEAN
// PART 1
// CORE + OSS MODULE
// ========================================


// ========================================
// CONFIG
// ========================================

const API_URL =
"https://script.google.com/macros/s/AKfycby__Lw6UXk4CezUKiTHIs0F-EXmEK3eaQfyBkfckdBjXGc5dOJxRwtZ_ILbg9h54ylb/exec";



const PAGE_LIMIT = 100;



// ========================================
// CACHE GLOBAL
// JANGAN DUPLIKAT
// ========================================

let OSS_CACHE = [];
let IMS_CACHE = [];
let MASTER_CACHE = [];
let DONE_CACHE = [];




// ========================================
// API REQUEST
// ========================================

async function apiRequest(action,data={}){


    try{


        const res = await fetch(

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


        const json = await res.json();


        return {

            success:true,

            data:json

        };


    }

    catch(e){


        console.error(
            "API ERROR",
            e
        );


        return {

            success:false,

            data:[],

            message:e.message

        };


    }


}






// ========================================
// SAFE REQUEST
// ========================================

async function safeRequest(action,data={}){


    const result = await apiRequest(

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
// CONNECTION
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
// OSS GET
// ========================================

async function getOSS(page=1){



    const result = await pageRequest(

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
// OSS GET ALL
// ========================================

async function getAllOSS(){



    let page=1;

    let all=[];



    while(true){



        const result = await pageRequest(

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

            result.data.length < PAGE_LIMIT

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


    const result = await safeRequest(

        "addOSS",

        data

    );


    await getOSS(1);


    return result;



}







// ========================================
// UPDATE OSS
// ========================================

async function updateOSSAPI(data){


    const result = await safeRequest(

        "updateOSS",

        data

    );


    await getOSS(1);


    return result;


}







// ========================================
// DELETE OSS
// ========================================

async function deleteOSSAPI(id){


    const result = await safeRequest(

        "deleteOSS",

        {

            id:id

        }

    );


    await getOSS(1);


    return result;



}







// ========================================
// BULK OSS EXCEL
// ========================================

async function bulkAddOSSAPI(rows){



    const result = await safeRequest(

        "bulkOSS",

        rows

    );


    await getOSS(1);


    return result;



}





// ========================================
// FIND OSS
// ========================================

function findOSS(ref){


    return OSS_CACHE.find(x=>

        String(x.reference_code)

        ===

        String(ref)

    );


}






console.log(

"API JS V3 PART 1 READY"

);

// ========================================
// OSS IMS MONITORING
// API JS V3 FINAL CLEAN
// PART 2
// IMS + MASTER + DONE MODULE
// ========================================


// ========================================
// IMS GET
// ========================================

async function getIMS(page=1){


    const result = await pageRequest(

        "getIMS",

        page

    );



    if(result.success){


        IMS_CACHE =

        result.data || [];


    }


    return IMS_CACHE;


}






// ========================================
// IMS GET ALL
// ========================================

async function getAllIMS(){


    let page=1;

    let all=[];



    while(true){



        const result = await pageRequest(

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
// ADD IMS
// ========================================

async function addIMSAPI(data){


    const result = await safeRequest(

        "addIMS",

        data

    );



    await getIMS(1);



    return result;



}







// ========================================
// UPDATE IMS
// ========================================

async function updateIMSAPI(data){


    const result = await safeRequest(

        "updateIMS",

        data

    );



    await getIMS(1);



    return result;



}







// ========================================
// DELETE IMS
// ========================================

async function deleteIMSAPI(id){


    const result = await safeRequest(

        "deleteIMS",

        {

            id:id

        }

    );



    await getIMS(1);



    return result;



}







// ========================================
// BULK IMS EXCEL
// ========================================

async function bulkAddIMSAPI(rows){


    const result = await safeRequest(

        "bulkIMS",

        rows

    );



    await getIMS(1);



    return result;



}








// ========================================
// FIND IMS
// ========================================

function findIMS(ref){


    return IMS_CACHE.find(x=>


        String(x.reference_code)

        ===

        String(ref)


    );


}








// ========================================
// MASTER GET
// ========================================

async function getMasterAPI(){


    const result = await safeRequest(

        "getMaster",

        {

            page:1,

            limit:PAGE_LIMIT

        }

    );



    if(result.success){


        MASTER_CACHE =

        result.data || [];


    }



    return MASTER_CACHE;



}








// ========================================
// DONE GET
// ========================================

async function getDONEAPI(){


    const result = await safeRequest(

        "getDONE",

        {

            page:1,

            limit:PAGE_LIMIT

        }

    );



    if(result.success){


        DONE_CACHE =

        result.data || [];


    }



    return DONE_CACHE;



}








// ========================================
// SYNC DONE
// ========================================

async function syncDONEAPI(){



    const result = await safeRequest(

        "syncDONE",

        {}

    );



    await getDONEAPI();


    await getIMS(1);



    return result;



}








// ========================================
// DASHBOARD API
// ========================================

async function getDashboardAPI(){


    const result = await safeRequest(

        "getDashboard",

        {}

    );



    if(result.success){


        return result.data || {};


    }



    return {};



}








// ========================================
// REFRESH ALL CACHE
// ========================================

async function refreshAllData(){


    await getOSS(1);


    await getIMS(1);


    await getMasterAPI();


    await getDONEAPI();



    return true;



}







console.log(

"API JS V3 PART 2 READY"

);

// ========================================
// OSS IMS MONITORING
// API JS V3 FINAL CLEAN
// PART 3
// UI CONTROLLER + CRUD + EXCEL IMPORT EXPORT
// ========================================


// ========================================
// GLOBAL EDIT
// ========================================

let EDIT_MODE = "";

let EDIT_ID = null;







// ========================================
// MODAL
// ========================================

function showModal(id){


    const el=document.getElementById(id);


    if(el)

    el.style.display="block";


}



function closeModal(id){


    const el=document.getElementById(id);


    if(el)

    el.style.display="none";


}








// ========================================
// VALUE HELPER
// ========================================

function getValue(id){


    const el=document.getElementById(id);


    return el ? el.value : "";


}



function setValue(id,value){


    const el=document.getElementById(id);


    if(el)

    el.value=value;


}









// ========================================
// OPEN OSS
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


        reference_code:getValue(
            "oss_reference"
        ),


        cust_id:getValue(
            "oss_cust"
        ),


        customer:getValue(
            "oss_customer"
        ),


        city:getValue(
            "oss_city"
        )


    };




    let result;



    if(

        EDIT_MODE==="OSS"

        &&

        EDIT_ID

    ){


        result=

        await updateOSSAPI(data);


    }

    else{


        result=

        await addOSSAPI(data);


    }





    if(result.success!==false){


        closeModal("ossModal");


        await refreshAllData();


    }



}








// ========================================
// OPEN IMS
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


        wo:getValue(
            "ims_wo"
        ),


        reference_code:getValue(
            "ims_reference"
        ),


        quotation:getValue(
            "ims_quotation"
        ),


        job_name:getValue(
            "ims_job"
        ),


        status:getValue(
            "ims_status"
        ),


        bulan:getValue(
            "ims_bulan"
        )


    };





    let result;



    if(

        EDIT_MODE==="IMS"

        &&

        EDIT_ID

    ){


        result=

        await updateIMSAPI(data);



    }

    else{


        result=

        await addIMSAPI(data);



    }







    if(result.success!==false){


        closeModal("imsModal");


        await refreshAllData();


    }




}








// ========================================
// DELETE
// ========================================

async function removeOSS(id){



    if(!confirm("Hapus OSS?"))

    return;



    await deleteOSSAPI(id);



    await refreshAllData();



}







async function removeIMS(id){



    if(!confirm("Hapus IMS?"))

    return;



    await deleteIMSAPI(id);



    await refreshAllData();



}









// ========================================
// EXPORT MASTER EXCEL
// ========================================

function exportMasterExcel(){



    if(typeof XLSX==="undefined")

    return;



    let rows = MASTER_CACHE.map(x=>({


        WO:x.wo || "",


        Reference_Code:x.reference_code || "",


        Customer:x.customer || "",


        City:x.city || "",


        Bulan:x.bulan || "",


        Job_Name:x.job_name || "",


        Status:x.status || "",


        Note:x.note || ""


    }));




    let ws=XLSX.utils.json_to_sheet(rows);



    let wb=XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "MASTER"

    );



    XLSX.writeFile(

        wb,

        "MASTER.xlsx"

    );



}









// ========================================
// IMPORT OSS EXCEL
// ========================================

function importOSSExcel(file){



    let reader=new FileReader();



    reader.onload=e=>{



        let wb=XLSX.read(

            new Uint8Array(

                e.target.result

            ),

            {

                type:"array"

            }

        );




        let ws=wb.Sheets[

            wb.SheetNames[0]

        ];




        let rows=XLSX.utils.sheet_to_json(ws);




        bulkAddOSSAPI(rows);



    };



    reader.readAsArrayBuffer(file);



}









// ========================================
// IMPORT IMS EXCEL
// ========================================

function importIMSExcel(file){



    let reader=new FileReader();



    reader.onload=e=>{



        let wb=XLSX.read(

            new Uint8Array(

                e.target.result

            ),

            {

                type:"array"

            }

        );




        let ws=wb.Sheets[

            wb.SheetNames[0]

        ];




        let rows=XLSX.utils.sheet_to_json(ws);




        bulkAddIMSAPI(rows);



    };



    reader.readAsArrayBuffer(file);



}








console.log(

"API JS V3 PART 3 READY"

);

// ========================================
// OSS IMS MONITORING
// API JS V3 FINAL CLEAN
// PART 4
// FINAL SYSTEM + DASHBOARD + REALTIME
// ========================================


// ========================================
// SYSTEM STATE
// ========================================

let SYSTEM_READY = false;

let SYSTEM_TIMER = null;








// ========================================
// TOAST
// ========================================

function showToast(message,type="success"){



    const el =

    document.getElementById(

        "toast"

    );



    if(!el)

    return;



    el.innerHTML = message;



    el.className =

    "toast " + type;



    el.style.display="block";




    setTimeout(()=>{


        el.style.display="none";


    },3000);



}









// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard(){



    try{



        const data =

        await getDashboardAPI();




        setText(

            "totalOSS",

            data.totalOSS || 0

        );



        setText(

            "totalIMS",

            data.totalIMS || 0

        );



        setText(

            "totalMaster",

            data.totalMaster || 0

        );



        setText(

            "totalBelum",

            data.belumIMS || 0

        );



        setText(

            "done",

            data.selesai || 0

        );



        setText(

            "progress",

            data.progress || 0

        );



        setText(

            "revisi",

            data.revisi || 0

        );



        setText(

            "belum",

            data.belumIMS || 0

        );




        setText(

            "lastUpdate",

            new Date()

            .toLocaleString(

                "id-ID"

            )

        );




        setText(

            "apiStatus",

            "🟢 Online"

        );



    }


    catch(e){


        console.error(

            "DASHBOARD ERROR",

            e

        );


        setText(

            "apiStatus",

            "🔴 Offline"

        );


    }



}








// ========================================
// TEXT HELPER
// ========================================

function setText(id,value){



    const el =

    document.getElementById(id);



    if(el)

    el.innerText=value;



}








// ========================================
// MASTER LOAD
// ========================================

async function loadMaster(){



    const data =

    await getMasterAPI();



    MASTER_CACHE=data || [];



    renderMaster(

        MASTER_CACHE

    );



}








// ========================================
// MASTER TABLE
// ========================================

function renderMaster(data){



    const tbody =

    document.getElementById(

        "masterData"

    );



    if(!tbody)

    return;




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

        <td>${item.status || ""}</td>

        <td>${item.note || "-"}</td>

        </tr>

        `;



    });




    tbody.innerHTML=html;



}








// ========================================
// REFRESH ALL
// ========================================

async function refreshSystem(){



    await refreshAllData();


    await loadDashboard();


    await loadMaster();



}









// ========================================
// REALTIME
// ========================================

function startRealtime(){



    stopRealtime();



    SYSTEM_TIMER =

    setInterval(()=>{



        refreshSystem();



    },60000);



}






function stopRealtime(){



    if(SYSTEM_TIMER){



        clearInterval(

            SYSTEM_TIMER

        );



        SYSTEM_TIMER=null;



    }



}








// ========================================
// INIT SYSTEM
// ========================================

async function initSystem(){



    try{



        await refreshSystem();



        SYSTEM_READY=true;



        startRealtime();



        console.log(

        "SYSTEM READY"

        );



    }



    catch(e){



        console.error(

            "SYSTEM INIT ERROR",

            e

        );



    }



}








// ========================================
// SEARCH MASTER
// ========================================

function searchMaster(keyword){



    keyword =

    keyword

    .toLowerCase();




    const result =

    MASTER_CACHE.filter(x=>{


        return (



            String(x.reference_code)

            .toLowerCase()

            .includes(keyword)



            ||



            String(x.customer)

            .toLowerCase()

            .includes(keyword)



            ||



            String(x.city)

            .toLowerCase()

            .includes(keyword)



        );



    });




    renderMaster(result);



}








// ========================================
// CLEAR CACHE
// ========================================

function clearCache(){



    OSS_CACHE=[];

    IMS_CACHE=[];

    MASTER_CACHE=[];

    DONE_CACHE=[];



}








// ========================================
// INIT
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

"API JS V3 FINAL COMPLETE"

);
