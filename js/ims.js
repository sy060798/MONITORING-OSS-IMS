// ========================================
// OSS IMS MONITORING
// IMS JS V7 CLEAN
// PART 1/5
// CORE + INIT + LOAD + RENDER
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
// INIT SYSTEM
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initIMS();

    }
);





async function initIMS(){


    try{


        console.log(
            "START IMS SYSTEM V7"
        );



        await checkIMSAPI();



        await refreshIMSData();



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



        return {

            success:false

        };


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
// LOAD IMS DATA
// ========================================

async function refreshIMSData(){



    try{


        showLoadingIMS(true);



        IMS_SYSTEM.loading=true;



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

                result.message ||

                "Gagal mengambil IMS"

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






        IMS_SYSTEM.online=true;



        IMS_SYSTEM.lastUpdate =

        new Date();







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


        IMS_SYSTEM.loading=false;



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

        !Array.isArray(data)

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

        (item,index)=>{



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


        }

    );






    tbody.innerHTML=html;



}









// ========================================
// STATUS BADGE
// ========================================

function imsStatusBadge(status){



    let cls="status-progress";



    if(

        [

            "Approved",

            "Booked",

            "Closed",

            "Ready to Invoice"

        ]

        .includes(status)

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
// UPDATE SUMMARY
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

    )

    .length;





    let rev =

    document.getElementById(

        "revisionIMS"

    );



    if(rev){


        rev.innerText=revisi;


    }



}









// ========================================
// UPDATE INFO
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


        IMS_SYSTEM.lastUpdate

        .toLocaleString(

            "id-ID"

        )


        :


        "-";



    }



}







console.log(

    "IMS JS V7 PART 1 READY"

);

 // ========================================
// OSS IMS MONITORING
// IMS JS V7 CLEAN
// PART 2/5
// CRUD + MODAL + FORM
// ========================================


// ========================================
// OPEN ADD IMS
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
// CLOSE IMS MODAL
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



    let data = {


        wo:

        getIMSValue(

            "wo"

        ),



        reference_code:

        getIMSValue(

            "imsReferenceCode"

        ),



        quotation:

        getIMSValue(

            "quotation"

        ),



        job_name:

        getIMSValue(

            "jobName"

        ),



        status:

        getIMSValue(

            "imsStatus"

        ),



        bulan:

        getIMSValue(

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



        return {


            success:false


        };


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



            IMS_EDIT_ID=null;



            await refreshIMSData();



        }



        else{


            alert(

                result.message ||

                "Gagal simpan IMS"

            );


        }






        return result;



    }



    catch(error){



        console.error(

            "SAVE IMS ERROR",

            error

        );



        alert(

            "Gagal menyimpan IMS"

        );



        return {


            success:false


        };


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







    try{



        let result =

        await apiRequest(

            "deleteIMS",

            {

                id:id

            }

        );







        if(result.success){



            await refreshIMSData();



        }



        else{


            alert(

                result.message ||

                "Gagal hapus IMS"

            );


        }



        return result;



    }



    catch(error){



        console.error(

            "DELETE IMS ERROR",

            error

        );


    }



}









// ========================================
// FORM HELPER
// ========================================

function getIMSValue(id){



    let el =

    document.getElementById(

        id

    );



    return el

    ?

    el.value.trim()

    :

    "";



}








function setIMSValue(id,value){



    let el =

    document.getElementById(

        id

    );



    if(el){



        el.value =

        value || "";



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

        id=>{


            setIMSValue(

                id,

                ""

            );


        }

    );







    setIMSValue(

        "imsStatus",

        "Progress"

    );



}









// ========================================
// DIRECT SAVE BUTTON SUPPORT
// ========================================

async function saveIMSFinal(){



    let result =

    await saveIMS();





    if(result.success){



        closeIMS();



    }



}



console.log(

"IMS JS V7 PART 2 READY"

);

// ========================================
// OSS IMS MONITORING
// IMS JS V7 CLEAN
// PART 3/5
// SEARCH + FILTER + EXCEL
// ========================================


// ========================================
// SEARCH IMS
// ========================================

function searchIMS(){



    let keyword =

    getIMSValue(

        "searchIMS"

    )

    .toLowerCase();







    let result =

    IMS_DATA.filter(item=>{



        return (



            String(

                item.wo || ""

            )

            .toLowerCase()

            .includes(keyword)





            ||





            String(

                item.reference_code || ""

            )

            .toLowerCase()

            .includes(keyword)





            ||





            String(

                item.quotation || ""

            )

            .toLowerCase()

            .includes(keyword)





            ||





            String(

                item.job_name || ""

            )

            .toLowerCase()

            .includes(keyword)





            ||





            String(

                item.customer || ""

            )

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

    getIMSValue(

        "statusFilter"

    );





    let bulan =

    getIMSValue(

        "monthFilterIMS"

    );








    let result =

    IMS_DATA.filter(item=>{



        let statusOK =

        !status

        ||

        item.status===status;







        let bulanOK =

        !bulan

        ||

        item.bulan===bulan;






        return (

            statusOK

            &&

            bulanOK

        );



    });







    renderIMS(result);



}









// ========================================
// GENERATE MONTH FILTER
// ========================================

function generateMonthFilterIMS(){



    let select =

    document.getElementById(

        "monthFilterIMS"

    );



    if(!select)

    return;








    let bulan =

    [

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
// SUMMARY DATA
// ========================================

function getIMSSummary(){



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

        data.filter(

            x=>

            x.status==="Progress"

        )

        .length,







        revisi:

        data.filter(

            x=>

            x.status==="Revisi"

        )

        .length,







        selesai:

        data.filter(

            x=>

                [

                    "Approved",

                    "Booked",

                    "Closed",

                    "Ready to Invoice"

                ]

                .includes(x.status)

        )

        .length



    };



}









// ========================================
// UPDATE DASHBOARD COUNTER
// ========================================

function updateTotalIMS(){



    let data =

    getIMSSummary();






    let total =

    document.getElementById(

        "totalIMS"

    );



    if(total){


        total.innerText=

        data.total;


    }







    let progress =

    document.getElementById(

        "progressIMS"

    );



    if(progress){


        progress.innerText=

        data.progress;


    }







    let revisi =

    document.getElementById(

        "revisionIMS"

    );



    if(revisi){


        revisi.innerText=

        data.revisi;


    }





}









// ========================================
// SORT IMS
// ========================================

function sortIMS(field){



    let data =

    [

        ...IMS_DATA

    ];







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



    if(

        typeof XLSX==="undefined"

    ){


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
// IMPORT EXCEL IMS
// ========================================

function importIMSExcel(file){



    if(!file)

    return;







    let reader =

    new FileReader();







    reader.onload = async function(e){



        try{



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








            let raw =

            XLSX.utils.sheet_to_json(

                sheet,

                {

                    defval:""

                }

            );








            let rows =

            raw.map(item=>({



                wo:

                item.wo ||

                item.WO ||

                "",





                reference_code:

                item.reference_code ||

                item.Reference_Code ||

                "",





                quotation:

                item.quotation ||

                item.Quotation ||

                "",





                job_name:

                item.job_name ||

                item.Job_Name ||

                "",





                status:

                item.status ||

                item.Status ||

                "Progress",





                bulan:

                item.bulan ||

                item.Bulan ||

                ""



            }));








            let result =

            await apiRequest(

                "bulkIMS",

                rows

            );







            if(result.success){


    alert(

`Import IMS selesai

✅ Berhasil masuk : ${result.inserted || 0}

⚠️ Duplikat tidak masuk : ${result.duplicate || 0}

📄 Total file : ${result.total || rows.length}`

    );


    await refreshIMSData();


}





        }

        catch(error){



            console.error(

                error

            );



            alert(

                "Import Excel gagal"

            );



        }



    };







    reader.readAsArrayBuffer(

        file

    );



}









// ========================================
// UPLOAD BUTTON
// ========================================

function uploadIMS(){



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







    importIMSExcel(file);



}









// ========================================
// TEMPLATE EXCEL
// ========================================

function downloadIMSTemplate(){



    if(

        typeof XLSX==="undefined"

    )

    return;







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







console.log(

"IMS JS V7 PART 3 READY"

);

// ========================================
// OSS IMS MONITORING
// IMS JS V7 CLEAN
// PART 4/5
// DASHBOARD + REALTIME + PAGINATION
// ========================================


// ========================================
// DASHBOARD SYNC
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
// SYNC IMS DASHBOARD
// ========================================

async function syncIMSData(){



    try{



        await refreshIMSData();







        if(

            typeof loadDashboard === "function"

        ){



            await loadDashboard();



        }







        console.log(

            "IMS DASHBOARD SYNC OK"

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



    let max =

    Math.ceil(

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



    if(!el)

    return;







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

            ...

            response.data

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
// BACKUP EXCEL FULL
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

    )

    return;








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
// DUPLICATE CHECK
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
// PRINT IMS
// ========================================

function printIMS(){



    window.print();



}









// ========================================
// MANUAL REFRESH
// ========================================

async function refreshIMS(){



    IMS_PAGE=1;



    await refreshIMSData();



}









console.log(

"IMS JS V7 PART 4 READY"

);

// ========================================
// OSS IMS MONITORING
// IMS JS V7 CLEAN
// PART 5/5 FINAL
// SYSTEM CONTROL + REALTIME + UPLOAD
// ========================================


// ========================================
// SYSTEM STATE
// ========================================

let IMS_TIMER = null;

let IMS_API_ONLINE = false;

let IMS_LAST_UPDATE = null;

let IMS_READY = false;









// ========================================
// UPLOAD EXCEL MODAL
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
// UPLOAD FINAL CONNECT
// ========================================

async function uploadIMSFinal(){



    let input =

    document.getElementById(

        "excelIMS"

    );



    if(!input){



        return;



    }







    let file =

    input.files[0];







    if(!file){



        alert(

            "Pilih file Excel"

        );



        return;



    }








    try{



        importIMSExcel(

            file

        );



    }



    catch(error){



        console.error(

            "UPLOAD IMS ERROR",

            error

        );



    }



}









// ========================================
// API STATUS UPDATE
// ========================================

function updateIMSSystemStatus(){



    let api =

    document.getElementById(

        "apiStatus"

    );



    if(api){



        api.innerText =



        IMS_API_ONLINE



        ?



        "🟢 API ONLINE"



        :



        "🔴 API OFFLINE";



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
// REALTIME SYNC
// ========================================

function startIMSRealtime(){



    stopIMSRealtime();







    IMS_TIMER =

    setInterval(()=>{



        refreshIMSData();




    },60000);



}









function stopIMSRealtime(){



    if(IMS_TIMER){



        clearInterval(

            IMS_TIMER

        );



        IMS_TIMER=null;



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



    catch(error){



        IMS_API_ONLINE=false;



    }







    updateIMSSystemStatus();



}









// ========================================
// FINAL INIT CONTROLLER
// ========================================

async function initIMSFinal(){



    try{



        console.log(

            "START IMS FINAL SYSTEM"

        );







        await checkIMSAPI();







        await refreshIMSData();







        startIMSRealtime();







        IMS_READY=true;







        IMS_API_ONLINE=true;







        IMS_LAST_UPDATE =

        new Date();







        updateIMSSystemStatus();







        console.log(

            "IMS FINAL READY"

        );



    }



    catch(error){



        console.error(

            "IMS FINAL INIT ERROR",

            error

        );



    }



}









// ========================================
// ESC CLOSE MODAL
// ========================================

document.addEventListener(

    "keydown",

    function(e){



        if(e.key==="Escape"){



            closeIMS();



            closeUploadIMS();



        }



    }

);









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
// AUTO API CHECK 5 MENIT
// ========================================

setInterval(()=>{



    monitorIMSAPI();



},300000);









// ========================================
// AUTO START
// ========================================

document.addEventListener(

    "DOMContentLoaded",

    ()=>{



        initIMSFinal();



    }

);









console.log(

"================================"

);


console.log(

"IMS JS V7 CLEAN FINAL READY"

);


console.log(

"CRUD + EXCEL + DASHBOARD + REALTIME ACTIVE"

);


console.log(

"================================"

);
