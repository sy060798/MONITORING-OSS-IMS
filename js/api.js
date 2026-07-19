// ========================================
// OSS IMS MONITORING
// API JS V4 FINAL FIX
// PART 1
// CORE + API REQUEST + OSS MODULE
// ========================================


// ========================================
// CONFIG
// ========================================

const API_URL =
"https://script.google.com/macros/s/AKfycby__Lw6UXk4CezUKiTHIs0F-EXmEK3eaQfyBkfckdBjXGc5dOJxRwtZ_ILbg9h54ylb/exec";


const PAGE_LIMIT = 100;




// ========================================
// CACHE GLOBAL
// ========================================

let OSS_CACHE = [];

let IMS_CACHE = [];

let MASTER_CACHE = [];

let DONE_CACHE = [];




// ========================================
// API REQUEST CLEAN
// FIX DOUBLE RESPONSE
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


                body:JSON.stringify({

                    action:action,

                    data:data

                })

            }

        );



        const json = await response.json();



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
// TEST CONNECTION
// ========================================


async function testConnection(){


    return await safeRequest(

        "test",

        {}

    );


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
// GET OSS
// ========================================


async function getOSS(page=1){



    const result = await pageRequest(

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



        const result = await pageRequest(

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
// BULK OSS
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


function findOSS(reference){



    return OSS_CACHE.find(item=>{


        return String(

            item.reference_code

        )


        ===


        String(reference);



    });



}





console.log(

"API JS V4 PART 1 READY"

);

// ========================================
// OSS IMS MONITORING
// API JS V4 FINAL FIX
// PART 2
// IMS + MASTER + DONE MODULE
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



        const result = await pageRequest(

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
// BULK IMS
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

function findIMS(reference){



    return IMS_CACHE.find(item=>{


        return String(

            item.reference_code

        )


        ===


        String(reference);



    });



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


        Array.isArray(result.data)


        ?


        result.data


        :


        [];



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


        Array.isArray(result.data)


        ?


        result.data


        :


        [];



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
// DASHBOARD
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

"API JS V4 PART 2 READY"

);

// ========================================
// API JS V4
// PART 3
// UI CONTROLLER + CRUD CONNECTOR
// ========================================


// ========================================
// GLOBAL STATE
// ========================================

let EDIT_TYPE = "";
let EDIT_ID = null;





// ========================================
// HELPER VALUE
// ========================================


function getValue(id){

    const el =
    document.getElementById(id);

    return el ? el.value.trim() : "";

}



function setValue(id,value){

    const el =
    document.getElementById(id);

    if(el){

        el.value = value || "";

    }

}





function setText(id,value){

    const el =
    document.getElementById(id);

    if(el){

        el.innerText = value ?? "";

    }

}





// ========================================
// MODAL
// ========================================


function openModal(id){

    const el =
    document.getElementById(id);

    if(el){

        el.style.display="flex";

    }

}



function closeModal(id){

    const el =
    document.getElementById(id);

    if(el){

        el.style.display="none";

    }

}





// ========================================
// OSS FORM
// ========================================


function openOSSForm(data={}){


    EDIT_TYPE="OSS";

    EDIT_ID=data.id || null;



    setValue(
        "referenceCode",
        data.reference_code
    );


    setValue(
        "custID",
        data.cust_id
    );


    setValue(
        "customer",
        data.customer
    );


    setValue(
        "city",
        data.city
    );



    openModal(
        "modalOSS"
    );


}





// ========================================
// SAVE OSS
// ========================================


async function submitOSS(){



    let payload={


        id:EDIT_ID,


        reference_code:
        getValue(
            "referenceCode"
        ),


        cust_id:
        getValue(
            "custID"
        ),


        customer:
        getValue(
            "customer"
        ),


        city:
        getValue(
            "city"
        )


    };




    let result;



    if(
        EDIT_TYPE==="OSS"
        &&
        EDIT_ID
    ){


        result =
        await updateOSSAPI(
            payload
        );


    }

    else{


        result =
        await addOSSAPI(
            payload
        );


    }




    if(result.success){


        closeModal(
            "modalOSS"
        );


        await loadOSS();


        await loadDashboard();


    }



}









// ========================================
// IMS FORM
// ========================================


function openIMSForm(data={}){


    EDIT_TYPE="IMS";

    EDIT_ID=data.id || null;




    setValue(
        "wo",
        data.wo
    );


    setValue(
        "imsReference",
        data.reference_code
    );


    setValue(
        "quotation",
        data.quotation
    );


    setValue(
        "jobName",
        data.job_name
    );


    setValue(
        "status",
        data.status
    );


    setValue(
        "bulan",
        data.bulan
    );




    openModal(
        "modalIMS"
    );



}







// ========================================
// SAVE IMS
// ========================================


async function submitIMS(){



    let payload={


        id:EDIT_ID,


        wo:
        getValue("wo"),


        reference_code:
        getValue(
            "imsReference"
        ),


        quotation:
        getValue(
            "quotation"
        ),


        job_name:
        getValue(
            "jobName"
        ),


        status:
        getValue(
            "status"
        ),


        bulan:
        getValue(
            "bulan"
        )


    };





    let result;



    if(
        EDIT_TYPE==="IMS"
        &&
        EDIT_ID
    ){


        result =
        await updateIMSAPI(
            payload
        );


    }

    else{


        result =
        await addIMSAPI(
            payload
        );


    }





    if(result.success){



        closeModal(
            "modalIMS"
        );


        await loadIMS();


        await loadDashboard();



    }



}









// ========================================
// DELETE OSS
// ========================================


async function deleteOSSRow(id){



    if(
        !confirm(
            "Hapus data OSS?"
        )
    )
    return;



    let result =
    await deleteOSSAPI(
        id
    );



    if(result.success){


        await loadOSS();


        await loadDashboard();


    }


}









// ========================================
// DELETE IMS
// ========================================


async function deleteIMSRow(id){



    if(
        !confirm(
            "Hapus data IMS?"
        )
    )
    return;




    let result =
    await deleteIMSAPI(
        id
    );



    if(result.success){


        await loadIMS();


        await loadDashboard();


    }



}









// ========================================
// SEARCH OSS
// ========================================


function searchOSS(){


    let key =
    getValue(
        "searchOSS"
    )
    .toLowerCase();



    let data =
    OSS_CACHE.filter(x=>{


        return (

        String(
            x.reference_code
        )
        .toLowerCase()
        .includes(key)


        ||

        String(
            x.customer
        )
        .toLowerCase()
        .includes(key)


        ||

        String(
            x.city
        )
        .toLowerCase()
        .includes(key)

        );


    });



    renderOSS(
        data
    );


}








// ========================================
// SEARCH IMS
// ========================================


function searchIMS(){


    let key =
    getValue(
        "searchIMS"
    )
    .toLowerCase();



    let data =
    IMS_CACHE.filter(x=>{


        return (

        String(x.reference_code)
        .toLowerCase()
        .includes(key)


        ||

        String(x.wo)
        .toLowerCase()
        .includes(key)


        ||

        String(x.job_name)
        .toLowerCase()
        .includes(key)

        );


    });



    renderIMS(
        data
    );


}







// ========================================
// EXPORT CACHE
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







console.log(
"API JS V4 PART 3 READY"
);

// ========================================
// API JS V4 FINAL CLEAN
// PART 4
// DASHBOARD + SYSTEM INIT + REALTIME
// ========================================


// ========================================
// SYSTEM STATE
// ========================================

let SYSTEM_READY=false;

let SYSTEM_INTERVAL=null;





// ========================================
// TEXT HELPER
// ========================================

function setText(id,value){


    const el=document.getElementById(id);


    if(el){

        el.innerText=value ?? "-";

    }


}






// ========================================
// TOAST
// ========================================

function showToast(msg,type="success"){


    const el=document.getElementById("toast");


    if(!el)return;


    el.innerHTML=msg;


    el.className="toast "+type;


    el.style.display="block";


    setTimeout(()=>{


        el.style.display="none";


    },3000);


}







// ========================================
// DASHBOARD LOAD
// ========================================

async function loadDashboard(){


    try{


        const result = await apiRequest(

            "getDashboard",

            {}

        );



        if(!result.success){

            throw new Error(
                result.message
            );

        }



        const data = normalizeAPI(

            result.data

        );



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

            "🔴 OFFLINE"

        );


    }



}








// ========================================
// MASTER LOAD
// ========================================

async function loadMaster(){



    try{


        const data = await getMasterAPI();



        MASTER_CACHE =

        Array.isArray(data)

        ?

        data

        :

        extractArray(data);



        renderMaster(

            MASTER_CACHE

        );



    }


    catch(e){


        console.error(

            "MASTER ERROR",

            e

        );


    }


}







// ========================================
// MASTER RENDER
// ========================================

function renderMaster(data){



    const tbody=document.getElementById(

        "masterData"

    );



    if(!tbody)return;



    if(!Array.isArray(data) || data.length===0){


        tbody.innerHTML=`

        <tr>

        <td colspan="8">

        Belum ada data

        </td>

        </tr>

        `;


        return;


    }





    let html="";



    data.forEach(item=>{


        html += `


        <tr>

        <td>${item.wo || "-"}</td>

        <td>${item.reference_code || "-"}</td>

        <td>${item.customer || "-"}</td>

        <td>${item.city || "-"}</td>

        <td>${item.bulan || "-"}</td>

        <td>${item.job_name || "-"}</td>

        <td>${item.status || "-"}</td>

        <td>${item.note || "-"}</td>

        </tr>


        `;


    });



    tbody.innerHTML=html;



}









// ========================================
// REFRESH SYSTEM
// ========================================

async function refreshSystem(){


    try{


        await refreshAllData();


        await loadDashboard();


        await loadMaster();



        console.log(

        "SYSTEM REFRESH OK"

        );


    }


    catch(e){


        console.error(

        "REFRESH ERROR",

        e

        );


    }



}







// ========================================
// REALTIME
// ========================================

function startRealtime(){



    stopRealtime();



    SYSTEM_INTERVAL=setInterval(()=>{


        refreshSystem();



    },60000);



}







function stopRealtime(){



    if(SYSTEM_INTERVAL){


        clearInterval(

            SYSTEM_INTERVAL

        );


        SYSTEM_INTERVAL=null;


    }


}









// ========================================
// SEARCH MASTER
// ========================================

function searchMaster(keyword){



    keyword=

    String(keyword)

    .toLowerCase();



    let result=MASTER_CACHE.filter(item=>{


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
// INIT SYSTEM
// ========================================

async function initSystem(){



    try{


        console.log(

        "START SYSTEM"

        );



        await testConnection();



        await refreshSystem();



        startRealtime();



        SYSTEM_READY=true;



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
// CLEANUP
// ========================================

window.addEventListener(

"beforeunload",

()=>{


    stopRealtime();


});








// ========================================
// START
// ========================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    initSystem();


});





console.log(

"API JS V4 FINAL COMPLETE"

);
