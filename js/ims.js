// ========================================
// OSS IMS MONITORING
// IMS JS V6 FULL SYNC
// PART 1
// CORE + API + CRUD
// ========================================


// ========================================
// GLOBAL STATE
// ========================================

let IMS_DATA = [];

let IMS_EDIT_ID = null;

let IMS_PAGE = 1;

let IMS_LIMIT = 10000;

let IMS_TOTAL = 0;


let IMS_SYSTEM = {

    online:false,

    lastUpdate:null,

    loading:false

};





// ========================================
// START SYSTEM
// ========================================

document.addEventListener(
"DOMContentLoaded",
function(){

    initIMS();

});






async function initIMS(){


    console.log(
        "START IMS SYSTEM V6"
    );


    await checkIMSAPI();


    await loadIMS();


}








// ========================================
// CHECK API
// ========================================

async function checkIMSAPI(){


    try{


        let result =

        await apiRequest(

            "test",

            {}

        );



        IMS_SYSTEM.online =

        result.success === true;



        return result;


    }

    catch(error){


        IMS_SYSTEM.online=false;


        console.error(
            "IMS API ERROR",
            error
        );


    }


}









// ========================================
// LOADING STATUS
// ========================================

function showLoadingIMS(state){


    let el =

    document.getElementById(
        "loadingIMS"
    );



    if(!el)
    return;



    el.innerText =


    state

    ?

    "⏳ Loading IMS..."

    :

    "🟢 IMS Ready";



}









// ========================================
// LOAD DATA IMS
// ========================================

async function loadIMS(){


    try{


        showLoadingIMS(true);



        let result =

        await apiRequest(

            "getIMS",

            {

                page:IMS_PAGE,

                limit:IMS_LIMIT

            }

        );





        if(

            !result

            ||

            !result.success

        ){


            throw new Error(

                result.message

            );


        }







        IMS_DATA =


        Array.isArray(

            result.data

        )

        ?


        result.data


        :


        [];






        IMS_TOTAL =

        IMS_DATA.length;




        IMS_SYSTEM.lastUpdate =

        new Date();



        IMS_SYSTEM.online=true;





        renderIMS(

            IMS_DATA

        );



        updateIMSSummary();


        updateIMSInfo();



    }



    catch(error){


        console.error(

            "LOAD IMS ERROR",

            error

        );


        IMS_DATA=[];


        renderIMS([]);



    }



    finally{


        showLoadingIMS(false);


    }



}









// ========================================
// RENDER TABLE IMS
// ========================================

function renderIMS(data){



    let tbody =

    document.getElementById(
        "imsData"
    );



    if(!tbody)
    return;






    if(

        !data

        ||

        data.length===0

    ){



        tbody.innerHTML=`

        <tr>

        <td colspan="7">

        Belum ada data IMS

        </td>

        </tr>

        `;


        return;


    }






    let html="";






    data.forEach(

    function(item,index){



        html += `

        <tr>



        <td>

        ${item.wo || "-"}

        </td>




        <td>

        ${item.reference_code || "-"}

        </td>




        <td>

        ${item.quotation || "-"}

        </td>




        <td>

        ${item.job_name || "-"}

        </td>




        <td>

        ${imsStatusBadge(item.status)}

        </td>




        <td>

        ${item.bulan || "-"}

        </td>




        <td>


        <button

        class="btn edit"

        onclick="editIMS(${index})"

        >

        ✏ Edit

        </button>



        <button

        class="btn delete"

        onclick="deleteIMSData('${item.id}')"

        >

        🗑 Hapus

        </button>


        </td>



        </tr>

        `;


    });



    tbody.innerHTML = html;



}









// ========================================
// STATUS BADGE
// ========================================

function imsStatusBadge(status){


    let cls="status-progress";



    if(

        status==="Approved"

        ||

        status==="Booked"

        ||

        status==="Closed"

        ||

        status==="Ready to Invoice"

    ){

        cls="status-sudah";

    }



    else if(

        status==="Revisi"

    ){

        cls="status-revisi";

    }





    return `

    <span class="badge ${cls}">

    ${status || "Progress"}

    </span>

    `;


}









// ========================================
// OPEN ADD MODAL
// ========================================

function openAddIMS(){



    IMS_EDIT_ID=null;



    clearIMSForm();



    let modal =

    document.getElementById(
        "modalIMS"
    );



    if(modal){

        modal.style.display="flex";

    }


}








// ========================================
// CLOSE MODAL
// ========================================

function closeIMS(){


    let modal =

    document.getElementById(
        "modalIMS"
    );



    if(modal){

        modal.style.display="none";

    }



}









// ========================================
// SAVE IMS
// ========================================

async function saveIMS(){



    let data={



        wo:getIMSValue(
            "wo"
        ),



        reference_code:getIMSValue(
            "imsReferenceCode"
        ),



        quotation:getIMSValue(
            "quotation"
        ),



        job_name:getIMSValue(
            "jobName"
        ),



        status:getIMSValue(
            "imsStatus"
        ),



        bulan:getIMSValue(
            "imsMonth"
        )



    };






    if(

        !data.wo

        ||

        !data.reference_code

    ){


        alert(
            "WO dan Reference Code wajib diisi"
        );


        return;


    }







    let action;



    if(IMS_EDIT_ID){



        action="updateIMS";


        data.id=

        IMS_EDIT_ID;



    }

    else{


        action="addIMS";


    }







    try{



        let result =

        await apiRequest(

            action,

            data

        );







        if(result.success){


            closeIMS();


            await loadIMS();



        }




    }



    catch(error){


        console.error(

            "SAVE IMS ERROR",

            error

        );


        alert(
            "Gagal simpan IMS"
        );


    }




}









// ========================================
// EDIT IMS
// ========================================

function editIMS(index){



    let item =

    IMS_DATA[index];



    if(!item)
    return;






    IMS_EDIT_ID =

    item.id;







    setIMSValue(
        "wo",
        item.wo
    );



    setIMSValue(
        "imsReferenceCode",
        item.reference_code
    );



    setIMSValue(
        "quotation",
        item.quotation
    );



    setIMSValue(
        "jobName",
        item.job_name
    );



    setIMSValue(
        "imsStatus",
        item.status
    );



    setIMSValue(
        "imsMonth",
        item.bulan
    );







    let modal =

    document.getElementById(
        "modalIMS"
    );



    if(modal){

        modal.style.display="flex";

    }


}









// ========================================
// DELETE IMS
// ========================================

async function deleteIMSData(id){



    if(

        !confirm(
            "Hapus data IMS?"
        )

    )
    return;





    let result =

    await apiRequest(

        "deleteIMS",

        {

            id:id

        }

    );





    if(result.success){


        await loadIMS();


    }



}









// ========================================
// FORM HELPER
// ========================================

function getIMSValue(id){



    let el =

    document.getElementById(id);



    return el

    ?

    el.value.trim()

    :

    "";



}






function setIMSValue(id,value){



    let el =

    document.getElementById(id);



    if(el){


        el.value=value || "";


    }



}








function clearIMSForm(){



    [

        "wo",

        "imsReferenceCode",

        "quotation",

        "jobName",

        "imsMonth"

    ]

    .forEach(

    function(id){


        setIMSValue(
            id,
            ""
        );


    });





    setIMSValue(

        "imsStatus",

        "Progress"

    );



}









// ========================================
// SUMMARY
// ========================================

function updateIMSSummary(){



    let total =

    document.getElementById(
        "totalIMS"
    );



    if(total){


        total.innerText =

        IMS_DATA.length;


    }






    let revisi =

    IMS_DATA.filter(

    x=>

    x.status==="Revisi"

    ).length;





    let rev =

    document.getElementById(
        "revisionIMS"
    );



    if(rev){


        rev.innerText=revisi;


    }




}








// ========================================
// INFO UPDATE
// ========================================

function updateIMSInfo(){



    let el =

    document.getElementById(
        "lastUpdateIMS"
    );



    if(el){


        el.innerText =


        IMS_SYSTEM.lastUpdate


        ?


        IMS_SYSTEM.lastUpdate.toLocaleString(
            "id-ID"
        )


        :


        "-";



    }



}







console.log(
"IMS JS V6 PART 1 READY"
);

// ========================================
// IMS MANAGEMENT SYSTEM V6
// PART 2
// SEARCH + FILTER + SUMMARY + EXCEL
// ========================================


// ========================================
// SEARCH IMS
// ========================================

function searchIMS(){


    let keyword = getValueIMS(
        "searchIMS"
    )
    .toLowerCase();



    let result = IMS_DATA.filter(item=>{


        return (

            String(item.wo || "")
            .toLowerCase()
            .includes(keyword)


            ||


            String(item.reference_code || "")
            .toLowerCase()
            .includes(keyword)



            ||


            String(item.quotation || "")
            .toLowerCase()
            .includes(keyword)



            ||


            String(item.job_name || "")
            .toLowerCase()
            .includes(keyword)



            ||


            String(item.customer || "")
            .toLowerCase()
            .includes(keyword)

        );


    });



    renderIMS(result);


}







// ========================================
// FILTER IMS
// ========================================

function filterIMS(){



    let status =
    getValueIMS(
        "statusFilter"
    );



    let bulan =
    getValueIMS(
        "monthFilterIMS"
    );





    let result =
    IMS_DATA.filter(item=>{



        let statusOK =

        !status

        ||

        item.status === status;





        let bulanOK =

        !bulan

        ||

        item.bulan === bulan;




        return (

            statusOK

            &&

            bulanOK

        );



    });





    renderIMS(result);



}









// ========================================
// GENERATE BULAN FILTER
// ========================================

function generateMonthFilterIMS(){


    let select =
    document.getElementById(
        "monthFilterIMS"
    );



    if(!select){

        return;

    }







    let bulan = [

        ...new Set(

            IMS_DATA.map(

                x=>x.bulan

            )

        )

    ];





    let html = `

    <option value="">

    Semua Bulan

    </option>

    `;





    bulan.forEach(item=>{


        if(item){


            html += `

            <option value="${item}">

            ${item}

            </option>

            `;


        }


    });




    select.innerHTML = html;



}









// ========================================
// SUMMARY DATA IMS
// ========================================

function getIMSSummary(){



    let data = Array.isArray(IMS_DATA)

    ?

    IMS_DATA

    :

    [];






    return {



        total:

        data.length,





        progress:

        data.filter(x=>

            x.status==="Progress"

        ).length,






        revisi:

        data.filter(x=>

            x.status==="Revisi"

        ).length,






        selesai:

        data.filter(x=>

            x.status==="Approved"

            ||

            x.status==="Booked"

            ||

            x.status==="Closed"

            ||

            x.status==="Ready to Invoice"

        ).length,






        belum:

        data.filter(x=>

            !x.status

        ).length



    };


}











// ========================================
// UPDATE COUNTER HTML
// ========================================

function updateTotalIMS(){



    let data =
    getIMSSummary();






    let total =
    document.getElementById(
        "totalIMS"
    );


    if(total){

        total.innerText =
        data.total;

    }








    let revisi =
    document.getElementById(
        "revisionIMS"
    );


    if(revisi){

        revisi.innerText =
        data.revisi;

    }






    let bulan =
    document.getElementById(
        "monthIMS"
    );



    if(bulan){


        let month =
        new Date()
        .toLocaleString(
            "id-ID",
            {
                month:"long"
            }
        );


        bulan.innerText =
        month;


    }




}









// ========================================
// SORT IMS
// ========================================

function sortIMS(field){



    let data =
    [...IMS_DATA];





    data.sort((a,b)=>{


        return String(

            a[field] || ""

        )

        .localeCompare(

            String(

                b[field] || ""

            )

        );


    });






    renderIMS(data);



}









// ========================================
// EXPORT EXCEL IMS
// ========================================

function exportIMSExcel(){



    if(typeof XLSX==="undefined"){


        alert(
            "Excel library belum aktif"
        );


        return;

    }






    let rows =
    IMS_DATA.map(item=>({



        WO:

        item.wo || "",




        Reference_Code:

        item.reference_code || "",




        Quotation:

        item.quotation || "",




        Job_Name:

        item.job_name || "",




        Status:

        item.status || "",




        Bulan:

        item.bulan || ""



    }));







    let ws =
    XLSX.utils.json_to_sheet(
        rows
    );





    let wb =
    XLSX.utils.book_new();






    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "IMS"

    );






    XLSX.writeFile(

        wb,

        "DATA_IMS.xlsx"

    );




}









// ========================================
// IMPORT EXCEL
// ========================================

function importIMSExcel(file){



    if(!file){

        return;

    }






    let reader =
    new FileReader();






    reader.onload=function(e){



        let workbook =
        XLSX.read(

            new Uint8Array(

                e.target.result

            ),

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







        bulkIMSAPI(rows)

        .then(result=>{


            if(result.success){



                alert(
                    "Import IMS berhasil"
                );



                refreshIMSData();



            }



        });





    };






    reader.readAsArrayBuffer(file);



}









// ========================================
// BULK API
// ========================================

async function bulkIMSAPI(rows){



    return await apiRequest(

        "bulkIMS",

        rows

    );



}









// ========================================
// DOWNLOAD TEMPLATE EXCEL
// ========================================

function downloadIMSTemplate(){



    if(typeof XLSX==="undefined"){

        alert(
            "Excel library belum aktif"
        );

        return;

    }







    let data=[{


        wo:"WO001",


        reference_code:"REF001",


        quotation:"Q001",


        job_name:"Project",


        status:"Progress",


        bulan:"Januari"



    }];






    let ws =
    XLSX.utils.json_to_sheet(
        data
    );





    let wb =
    XLSX.utils.book_new();






    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "TEMPLATE"

    );






    XLSX.writeFile(

        wb,

        "TEMPLATE_IMS.xlsx"

    );



}








// ========================================
// UPLOAD BUTTON HTML CONNECT
// ========================================

function uploadIMS(){



    let file =
    document.getElementById(
        "excelIMS"
    ).files[0];



    if(!file){


        alert(
            "Pilih file Excel"
        );


        return;

    }





    importIMSExcel(file);





}







console.log(
"IMS JS V6 PART 2 READY"
);

// ========================================
// IMS MANAGEMENT SYSTEM V6
// PART 3
// DASHBOARD + REALTIME + PAGINATION
// ========================================


// ========================================
// DASHBOARD SUMMARY CONNECT
// ========================================

function updateIMSDashboard(){


    let data =
    getIMSSummary();



    let total =
    document.getElementById(
        "totalIMS"
    );


    if(total){

        total.innerText =
        data.total;

    }






    let progress =
    document.getElementById(
        "progressIMS"
    );


    if(progress){

        progress.innerText =
        data.progress;

    }






    let revisi =
    document.getElementById(
        "revisionIMS"
    );


    if(revisi){

        revisi.innerText =
        data.revisi;

    }






    let selesai =
    document.getElementById(
        "doneIMS"
    );


    if(selesai){

        selesai.innerText =
        data.selesai;

    }



}









// ========================================
// SUMMARY UNTUK DASHBOARD.JS
// ========================================

function getIMSDataSummary(){



    let data =
    Array.isArray(IMS_DATA)

    ?

    IMS_DATA

    :

    [];





    return {



        total:

        data.length,




        progress:

        data.filter(x=>

            x.status==="Progress"

        ).length,






        revisi:

        data.filter(x=>

            x.status==="Revisi"

        ).length,






        selesai:

        data.filter(x=>

            x.status==="Approved"

            ||

            x.status==="Booked"

            ||

            x.status==="Closed"

            ||

            x.status==="Ready to Invoice"

        ).length





    };



}









// ========================================
// SYNC IMS KE DASHBOARD
// ========================================

async function syncIMSData(){



    try{



        await refreshIMSData();






        if(
            typeof loadDashboard==="function"
        ){



            await loadDashboard();



        }






        console.log(

            "IMS SYNC DASHBOARD OK"

        );



    }



    catch(error){



        console.error(

            "IMS SYNC ERROR",

            error

        );



    }



}









// ========================================
// PAGINATION NEXT
// ========================================

function nextIMSPage(){



    let max = Math.ceil(

        IMS_TOTAL /

        IMS_LIMIT

    );





    if(

        IMS_PAGE < max

    ){



        IMS_PAGE++;



        refreshIMSData();



    }



}









// ========================================
// PAGINATION PREVIOUS
// ========================================

function prevIMSPage(){



    if(

        IMS_PAGE > 1

    ){



        IMS_PAGE--;



        refreshIMSData();



    }



}









// ========================================
// RENDER PAGINATION
// ========================================

function renderIMSPagination(){



    let el =
    document.getElementById(
        "imsPagination"
    );



    if(!el){

        return;

    }






    let totalPage =
    Math.ceil(

        IMS_TOTAL /

        IMS_LIMIT

    );






    el.innerHTML = `



    <button onclick="prevIMSPage()">

    ◀

    </button>



    <span>

    Halaman ${IMS_PAGE}

    /

    ${totalPage || 1}

    </span>




    <button onclick="nextIMSPage()">

    ▶

    </button>



    `;



}









// ========================================
// GET ALL DATA IMS
// ========================================

async function getAllIMSData(){



    let result=[];



    let page=1;



    while(true){



        let response =
        await apiRequest(

            "getIMS",

            {

                page:page,

                limit:100

            }

        );





        if(

            !response.success

            ||

            !Array.isArray(
                response.data
            )

        ){

            break;

        }






        if(
            response.data.length===0
        ){

            break;

        }






        result.push(

            ...response.data

        );






        if(

            response.data.length < 100

        ){

            break;

        }





        page++;



    }







    return result;



}









// ========================================
// BACKUP EXCEL FULL IMS
// ========================================

async function backupIMSExcel(){



    let data =
    await getAllIMSData();






    if(!data.length){


        alert(

            "Tidak ada data IMS"

        );


        return;

    }






    if(
        typeof XLSX==="undefined"
    ){


        alert(

            "Excel library belum aktif"

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

        "IMS_BACKUP"

    );






    XLSX.writeFile(

        wb,

        "BACKUP_IMS_FULL.xlsx"

    );



}









// ========================================
// DELETE MULTIPLE IMS
// ========================================

async function deleteMultipleIMS(ids){



    if(

        !Array.isArray(ids)

    ){

        return;

    }







    for(
        let id of ids
    ){



        await apiRequest(

            "deleteIMS",

            {

                id:id

            }

        );



    }







    await refreshIMSData();



}









// ========================================
// CEK DUPLIKAT REFERENCE CODE
// ========================================

function checkDuplicateIMS(ref){



    return IMS_DATA.some(item=>{


        return String(

            item.reference_code || ""

        )

        ===

        String(

            ref || ""

        );



    });



}









// ========================================
// PRINT DATA IMS
// ========================================

function printIMS(){


    window.print();


}









// ========================================
// AUTO REFRESH MANUAL
// ========================================

async function refreshIMS(){



    IMS_PAGE=1;



    await refreshIMSData();



}









console.log(
"IMS JS V6 PART 3 READY"
);

// ========================================
// IMS MANAGEMENT SYSTEM V6
// PART 4
// INIT + MODAL + REALTIME + API STATUS
// ========================================



let IMS_TIMER = null;

let IMS_API_ONLINE = false;

let IMS_LAST_UPDATE = null;

let IMS_READY = false;









// ========================================
// INIT SYSTEM IMS
// ========================================

async function initIMSSystem(){


    try{


        console.log(
            "START IMS SYSTEM V6"
        );



        await checkIMSAPI();



        await refreshIMSData();




        startIMSRealtime();




        IMS_READY=true;



        updateIMSSystemStatus();




        console.log(
            "IMS SYSTEM READY"
        );



    }


    catch(error){


        console.error(

            "IMS INIT ERROR",

            error

        );


    }



}









// ========================================
// CHECK API
// ========================================

async function checkIMSAPI(){



    try{


        let result =
        await apiRequest(

            "test",

            {}

        );




        IMS_API_ONLINE =

        result.success===true;




        return result;



    }


    catch(error){


        IMS_API_ONLINE=false;


        return {

            success:false

        };


    }



}









// ========================================
// UPDATE STATUS HTML
// ========================================

function updateIMSSystemStatus(){



    let api =
    document.getElementById(
        "apiStatus"
    );



    if(api){



        api.innerHTML =

        IMS_API_ONLINE

        ?

        "🟢 API Online"

        :

        "🔴 API Offline";


    }






    let update =
    document.getElementById(
        "lastUpdateIMS"
    );



    if(update && IMS_LAST_UPDATE){



        update.innerText =

        IMS_LAST_UPDATE

        .toLocaleString(
            "id-ID"
        );



    }



}









// ========================================
// UPDATE INFO IMS
// FIX ERROR
// ========================================

function updateIMSInfo(){



    IMS_LAST_UPDATE =
    new Date();





    let el =
    document.getElementById(
        "lastUpdateIMS"
    );




    if(el){



        el.innerText =

        IMS_LAST_UPDATE

        .toLocaleString(
            "id-ID"
        );


    }






    updateIMSSystemStatus();



}









// ========================================
// REALTIME AUTO SYNC
// ========================================

function startIMSRealtime(){



    stopIMSRealtime();




    IMS_TIMER =

    setInterval(()=>{


        refreshIMSData();



    },60000);



}









// ========================================
// STOP REALTIME
// ========================================

function stopIMSRealtime(){



    if(IMS_TIMER){



        clearInterval(
            IMS_TIMER
        );



        IMS_TIMER=null;


    }



}









// ========================================
// MODAL TAMBAH IMS
// ========================================

function openAddIMS(){



    let modal =
    document.getElementById(
        "modalIMS"
    );



    if(modal){



        modal.style.display="flex";



    }






    if(!IMS_EDIT_ID){


        resetIMSForm();



    }



}









function closeIMS(){



    let modal =
    document.getElementById(
        "modalIMS"
    );



    if(modal){


        modal.style.display="none";


    }



}









// ========================================
// MODAL UPLOAD EXCEL
// ========================================

function openUploadIMS(){



    let modal =
    document.getElementById(
        "uploadIMSModal"
    );



    if(modal){


        modal.style.display="flex";


    }



}









function closeUploadIMS(){



    let modal =
    document.getElementById(
        "uploadIMSModal"
    );



    if(modal){


        modal.style.display="none";


    }



}









// ========================================
// AFTER SAVE CLOSE MODAL
// ========================================

async function saveIMSFinal(){



    await saveIMS();



    closeIMS();



    await refreshIMSData();



}









// ========================================
// CONNECT BUTTON ESC
// ========================================

document.addEventListener(

"keydown",

function(e){



    if(e.key==="Escape"){



        closeIMS();



        closeUploadIMS();



    }



});









// ========================================
// CLEANUP
// ========================================

window.addEventListener(

"beforeunload",

()=>{


    stopIMSRealtime();


}

);









// ========================================
// AUTO START
// ========================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    initIMSSystem();



}

);









console.log(
"IMS JS V6 PART 4 READY"
);


// ========================================
// IMS MANAGEMENT SYSTEM V6
// PART 5 FINAL
// PRODUCTION SYNC CONTROL
// ========================================



// ========================================
// FINAL REFRESH CONTROLLER
// ========================================

async function finalRefreshIMS(){


    try{


        showLoadingIMS(true);



        let response =

        await apiRequest(

            "getIMS",

            {

                page:IMS_PAGE,

                limit:IMS_LIMIT

            }

        );





        if(

            !response

            ||

            !response.success

        ){


            throw new Error(

                response.message ||

                "IMS gagal load"

            );


        }







        IMS_DATA =

        Array.isArray(response.data)

        ?

        response.data

        :

        [];






        IMS_TOTAL =

        IMS_DATA.length;







        renderIMS(

            IMS_DATA

        );




        updateTotalIMS();



        updateIMSDashboard();



        generateMonthFilterIMS();



        updateIMSInfo();




        IMS_API_ONLINE=true;




    }



    catch(error){



        console.error(

            "FINAL IMS LOAD ERROR",

            error

        );



        IMS_API_ONLINE=false;



    }



    finally{


        showLoadingIMS(false);



        updateIMSSystemStatus();



    }



}









// ========================================
// OVERRIDE REFRESH DATA
// ========================================

window.refreshIMSData = finalRefreshIMS;









// ========================================
// SAVE FINAL CONNECT
// ========================================

async function saveIMSFinal(){



    try{



        await saveIMS();



        closeIMS();



        await finalRefreshIMS();



        if(
            typeof loadDashboard==="function"
        ){


            await loadDashboard();


        }





    }



    catch(error){



        console.error(

            "SAVE FINAL ERROR",

            error

        );



        alert(

            "Gagal menyimpan IMS"

        );



    }



}









// ========================================
// DELETE FINAL
// ========================================

async function deleteIMSFinal(index){



    let item =
    IMS_DATA[index];



    if(!item){

        return;

    }




    if(

        !confirm(
            "Hapus data IMS?"
        )

    ){

        return;

    }





    try{



        let result =

        await apiRequest(

            "deleteIMS",

            {

                id:item.id

            }

        );







        if(result.success){



            await finalRefreshIMS();




            if(
                typeof loadDashboard==="function"
            ){


                loadDashboard();


            }



        }




    }



    catch(error){



        console.error(

            "DELETE IMS ERROR",

            error

        );



    }



}









// ========================================
// EXCEL UPLOAD FINAL
// ========================================

async function uploadIMSFinal(){



    let file =

    document.getElementById(
        "excelIMS"
    )
    .files[0];




    if(!file){


        alert(

            "Pilih file Excel"

        );


        return;


    }





    try{



        importIMSExcel(file);



    }


    catch(error){


        console.error(

            "UPLOAD ERROR",

            error

        );


    }



}









// ========================================
// API HEALTH MONITOR
// ========================================

async function monitorIMSAPI(){



    try{



        let result =

        await apiRequest(

            "test",

            {}

        );




        IMS_API_ONLINE =

        result.success===true;



    }



    catch(e){


        IMS_API_ONLINE=false;


    }





    updateIMSSystemStatus();



}









// ========================================
// AUTO API CHECK
// ========================================

setInterval(()=>{


    monitorIMSAPI();



},300000);









// ========================================
// PAGE EXIT CLEAN
// ========================================

window.addEventListener(

"unload",

()=>{


    stopIMSRealtime();


}

);









// ========================================
// FINAL READY
// ========================================

console.log(

"================================"

);


console.log(

"IMS JS V6 FINAL PRODUCTION READY"

);


console.log(

"API + EXCEL + DASHBOARD + REALTIME ACTIVE"

);


console.log(

"================================"

);
