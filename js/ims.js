// ========================================
// IMS MANAGEMENT SYSTEM V5
// API JS V4 COMPATIBLE
// PART 1
// CORE + CRUD IMS
// ========================================


let IMS_DATA = [];

let IMS_EDIT_ID = null;

let IMS_PAGE = 1;

let IMS_LIMIT = 100;

let IMS_TOTAL = 0;





// ========================================
// LOAD IMS
// ========================================

async function loadIMS(){


    try{


        showLoadingIMS(true);



        const result = await apiRequest(

            "getIMS",

            {

                page:IMS_PAGE,

                limit:IMS_LIMIT

            }

        );



        if(!result.success){


            throw new Error(

                result.message

            );


        }





        const data = normalizeAPI(

            result.data

        );




        IMS_DATA =

        extractArray(data);




        IMS_TOTAL =

        IMS_DATA.length;




        renderIMS(

            IMS_DATA

        );




        updateTotalIMS();



        generateMonthFilterIMS();



        updateIMSInfo();




    }


    catch(error){



        console.error(

            "LOAD IMS ERROR",

            error

        );



        renderIMS([]);



    }


    finally{



        showLoadingIMS(false);



    }



}









// ========================================
// RENDER IMS TABLE
// ========================================

function renderIMS(data){



    const table =

    document.getElementById(

        "imsData"

    );




    if(!table)

    return;





    if(

        !Array.isArray(data)

        ||

        data.length===0

    ){


        table.innerHTML=`

        <tr>

        <td colspan="7">

        Belum ada data IMS

        </td>

        </tr>

        `;


        return;


    }







    let html="";





    data.forEach((item,index)=>{



        html+=`

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

        ${statusBadge(item.status)}

        </td>



        <td>

        ${item.bulan || "-"}

        </td>



        <td>


        <button

        class="btn edit"

        onclick="editIMS(${index})">

        ✏ Edit

        </button>



        <button

        class="btn delete"

        onclick="removeIMS(${index})">

        🗑 Hapus

        </button>


        </td>



        </tr>

        `;



    });






    table.innerHTML=html;



}









// ========================================
// SAVE IMS
// ========================================

async function saveIMS(){



    let data={



        wo:getValueIMS(

            "wo"

        ),



        reference_code:getValueIMS(

            "imsReferenceCode"

        ),



        quotation:getValueIMS(

            "quotation"

        ),



        job_name:getValueIMS(

            "jobName"

        ),



        status:getValueIMS(

            "imsStatus"

        ),



        bulan:getValueIMS(

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







    try{



        let result;



        if(IMS_EDIT_ID){



            result = await apiRequest(

                "updateIMS",

                {

                    id:IMS_EDIT_ID,

                    ...data

                }

            );



        }

        else{



            result = await apiRequest(

                "addIMS",

                data

            );



        }







        if(result.success){



            closeIMS();



            resetIMSForm();



            await loadIMS();



        }



    }


    catch(e){



        console.error(

            "SAVE IMS ERROR",

            e

        );



        alert(

        "Gagal menyimpan IMS"

        );


    }



}









// ========================================
// EDIT IMS
// ========================================

function editIMS(index){



    let item = IMS_DATA[index];




    if(!item)

    return;





    IMS_EDIT_ID = item.id;




    setValueIMS(

        "wo",

        item.wo

    );



    setValueIMS(

        "imsReferenceCode",

        item.reference_code

    );



    setValueIMS(

        "quotation",

        item.quotation

    );



    setValueIMS(

        "jobName",

        item.job_name

    );



    setValueIMS(

        "imsStatus",

        item.status

    );



    setValueIMS(

        "imsMonth",

        item.bulan

    );





    openAddIMS();



}









// ========================================
// DELETE IMS
// ========================================

async function removeIMS(index){



    let item = IMS_DATA[index];



    if(!item)

    return;





    if(!confirm(

        "Hapus data IMS?"

    ))

    return;






    let result = await apiRequest(

        "deleteIMS",

        {

            id:item.id

        }

    );






    if(result.success){


        await loadIMS();


    }



}









// ========================================
// FORM HELPER
// ========================================

function getValueIMS(id){



    let el=document.getElementById(id);



    return el ?

    el.value.trim()

    :

    "";



}





function setValueIMS(id,value){



    let el=document.getElementById(id);



    if(el){


        el.value=value || "";


    }



}









// ========================================
// RESET FORM
// ========================================

function resetIMSForm(){



    IMS_EDIT_ID=null;




    [

    "wo",

    "imsReferenceCode",

    "quotation",

    "jobName",

    "imsMonth"

    ]

    .forEach(id=>{


        setValueIMS(

            id,

            ""

        );


    });





    setValueIMS(

        "imsStatus",

        "Progress"

    );



}









// ========================================
// STATUS BADGE
// ========================================

function statusBadge(status){



    let cls="status-progress";



    if(

        status==="Done"

        ||

        status==="Closed"

        ||

        status==="Approved"

    ){


        cls="status-sudah";


    }

    else if(status==="Revisi"){



        cls="status-revisi";


    }







    return `


    <span class="badge ${cls}">

    ${status || "Progress"}

    </span>


    `;



}









console.log(

"IMS JS V5 PART 1 READY"

);
// ========================================
// IMS MANAGEMENT SYSTEM V5
// API JS V4 COMPATIBLE
// PART 2
// FILTER + PAGINATION + EXCEL + REFRESH
// ========================================


// ========================================
// SEARCH IMS
// ========================================

function searchIMS(){


    let keyword =

    getValueIMS(

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



        String(item.customer || "")

        .toLowerCase()

        .includes(keyword)



        ||



        String(item.job_name || "")

        .toLowerCase()

        .includes(keyword)



        );



    });





    renderIMS(result);



}









// ========================================
// FILTER STATUS + BULAN
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





    let result = IMS_DATA.filter(item=>{



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
// GENERATE BULAN FILTER
// ========================================

function generateMonthFilterIMS(){



    let select =

    document.getElementById(

        "monthFilterIMS"

    );



    if(!select)

    return;







    let list = [

        ...new Set(

            IMS_DATA.map(

                x=>x.bulan

            )

        )

    ];







    let html=`


    <option value="">

    Semua Bulan

    </option>


    `;







    list.forEach(bulan=>{


        if(bulan){


            html += `


            <option value="${bulan}">

            ${bulan}

            </option>


            `;


        }


    });







    select.innerHTML=html;



}









// ========================================
// UPDATE TOTAL IMS
// ========================================

function updateTotalIMS(){



    let total =

    document.getElementById(

        "totalIMS"

    );




    if(total){


        total.innerText =

        IMS_DATA.length +

        " Data";


    }






    let revisi =

    document.getElementById(

        "revisionIMS"

    );





    if(revisi){



        revisi.innerText =


        IMS_DATA.filter(x=>

            x.status==="Revisi"

        ).length;



    }







    let selesai =

    document.getElementById(

        "doneIMS"

    );




    if(selesai){



        selesai.innerText =


        IMS_DATA.filter(x=>


            x.status==="Done"

            ||

            x.status==="Closed"


        ).length;



    }




}









// ========================================
// PAGINATION
// ========================================

function nextIMSPage(){



    let max = Math.ceil(


        IMS_TOTAL /

        IMS_LIMIT


    );





    if(IMS_PAGE < max){



        IMS_PAGE++;



        loadIMS();



    }



}








function prevIMSPage(){



    if(IMS_PAGE > 1){



        IMS_PAGE--;



        loadIMS();



    }



}








function renderIMSPagination(){



    let el =

    document.getElementById(

        "imsPagination"

    );




    if(!el)

    return;







    let totalPage = Math.ceil(

        IMS_TOTAL /

        IMS_LIMIT

    );







    el.innerHTML=`


    <button onclick="prevIMSPage()">

    ◀

    </button>



    <span>

    ${IMS_PAGE}

    /

    ${totalPage || 1}

    </span>




    <button onclick="nextIMSPage()">

    ▶

    </button>



    `;



}









// ========================================
// SORT IMS
// ========================================

function sortIMS(field){



    let result=[

        ...IMS_DATA

    ];





    result.sort((a,b)=>{



        return String(

            a[field] || ""

        )

        .localeCompare(

            String(

                b[field] || ""

            )

        );



    });






    renderIMS(result);



}









// ========================================
// REFRESH IMS
// ========================================

async function refreshIMS(){



    IMS_PAGE=1;



    await loadIMS();



}









// ========================================
// IMPORT EXCEL IMS
// ========================================

function importIMSExcel(file){



    if(typeof XLSX==="undefined"){


        alert(

        "Library Excel belum aktif"

        );


        return;


    }







    let reader=new FileReader();





    reader.onload=function(e){



        let wb=XLSX.read(


            new Uint8Array(

                e.target.result

            ),

            {

                type:"array"

            }


        );







        let ws=

        wb.Sheets[

            wb.SheetNames[0]

        ];







        let rows =

        XLSX.utils.sheet_to_json(

            ws

        );







        bulkIMSAPI(rows)

        .then(result=>{



            if(result.success){



                alert(

                "Import IMS berhasil"

                );



                loadIMS();



            }



        });






    };







    reader.readAsArrayBuffer(file);



}









// ========================================
// BULK IMS API
// ========================================

async function bulkIMSAPI(rows){



    return await apiRequest(

        "bulkIMS",

        rows

    );



}









// ========================================
// EXPORT IMS EXCEL
// ========================================

function exportIMSExcel(){



    if(typeof XLSX==="undefined")

    return;






    let rows = IMS_DATA.map(item=>({



        WO:item.wo || "",



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








    let ws=

    XLSX.utils.json_to_sheet(

        rows

    );







    let wb=

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
// TEMPLATE EXCEL IMS
// ========================================

function downloadIMSTemplate(){



    if(typeof XLSX==="undefined")

    return;







    let data=[{


        wo:"WO001",

        reference_code:"REF001",

        quotation:"Q001",

        job_name:"Project",

        status:"Progress",

        bulan:"Januari"


    }];







    let ws=

    XLSX.utils.json_to_sheet(

        data

    );







    let wb=

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

"IMS JS V5 PART 2 READY"

);

// ========================================
// IMS MANAGEMENT SYSTEM V5
// API.JS V3 COMPATIBLE
// PART 3
// FILTER + DASHBOARD CONNECT + EXCEL
// ========================================


// ========================================
// GLOBAL FILTER
// ========================================

function searchIMS(){


    let keyword =

    document

    .getElementById(
        "searchIMS"
    )

    ?.value

    .toLowerCase()

    || "";




    let result = imsData.filter(item=>{


        return (


            String(item.wo || "")

            .toLowerCase()

            .includes(keyword)



            ||



            String(item.reference_code || "")

            .toLowerCase()

            .includes(keyword)



            ||



            String(item.customer || "")

            .toLowerCase()

            .includes(keyword)



            ||



            String(item.job_name || "")

            .toLowerCase()

            .includes(keyword)



        );


    });




    tampilkanIMS(result);



}








// ========================================
// SORT IMS
// ========================================


function sortIMS(field){


    let result=[...imsData];



    result.sort((a,b)=>{


        return String(

            a[field] || ""

        )

        .localeCompare(

            String(

                b[field] || ""

            )

        );


    });



    tampilkanIMS(result);



}








// ========================================
// FILTER STATUS QUICK
// ========================================


function filterIMSStatus(status){



    let result = imsData.filter(item=>{


        return item.status === status;


    });



    tampilkanIMS(result);



}








// ========================================
// SUMMARY IMS
// ========================================


function getIMSSummary(){



    let total = imsData.length;



    let progress = imsData.filter(x=>

        x.status==="Progress"

    ).length;




    let selesai = imsData.filter(x=>

        x.status==="Closed"

        ||

        x.status==="Done"

    ).length;





    let revisi = imsData.filter(x=>

        x.status==="Revisi"

    ).length;




    let approved = imsData.filter(x=>

        x.status==="Approved"

    ).length;






    return {


        total:total,


        progress:progress,


        selesai:selesai,


        revisi:revisi,


        approved:approved


    };



}









// ========================================
// UPDATE DASHBOARD IMS
// ========================================


function updateIMSDashboard(){



    let data = getIMSSummary();




    let total = document.getElementById(

        "totalIMS"

    );



    if(total){

        total.innerText=data.total+" Data";

    }






    let progress = document.getElementById(

        "progressIMS"

    );



    if(progress){

        progress.innerText=data.progress;

    }






    let revisi = document.getElementById(

        "revisionIMS"

    );



    if(revisi){

        revisi.innerText=data.revisi;

    }






    let selesai = document.getElementById(

        "doneIMS"

    );



    if(selesai){

        selesai.innerText=data.selesai;

    }




}










// ========================================
// PATCH LOAD IMS
// ========================================


async function refreshIMSData(){


    try{


        showLoadingIMS(true);



        const result = await getIMS();



        imsData = result || [];



        tampilkanIMS(

            imsData

        );



        updateTotalIMS();



        updateIMSDashboard();



        generateMonthFilterIMS();



        updateIMSInfo();



    }



    catch(error){


        console.error(

            "REFRESH IMS ERROR",

            error

        );


    }



    finally{


        showLoadingIMS(false);


    }



}









// ========================================
// EXPORT IMS EXCEL
// ========================================


function exportIMSExcel(){



    if(typeof XLSX==="undefined"){


        alert(

            "Excel library belum aktif"

        );


        return;


    }






    let rows = imsData.map(item=>({



        WO:item.wo || "",



        Reference_Code:item.reference_code || "",



        Quotation:item.quotation || "",



        Job_Name:item.job_name || "",



        Status:item.status || "",



        Bulan:item.bulan || ""



    }));






    let ws = XLSX.utils.json_to_sheet(rows);




    let wb = XLSX.utils.book_new();




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
// IMPORT IMS EXCEL V5
// ========================================


function importIMSExcelV5(file){



    if(!file){

        return;

    }




    let reader = new FileReader();




    reader.onload=function(e){



        let workbook = XLSX.read(

            new Uint8Array(

                e.target.result

            ),

            {

                type:"array"

            }

        );





        let sheet = workbook.Sheets[

            workbook.SheetNames[0]

        ];






        let rows = XLSX.utils.sheet_to_json(

            sheet

        );







        bulkAddIMSAPI(rows)

        .then(()=>{


            alert(

            "Import IMS berhasil"

            );


            refreshIMSData();



        });



    };





    reader.readAsArrayBuffer(file);



}









// ========================================
// TEMPLATE IMS
// ========================================


function downloadIMSTemplate(){



    if(typeof XLSX==="undefined")

    return;




    let data=[{


        wo:"WO001",


        reference_code:"REF001",


        quotation:"Q001",


        job_name:"Project",


        status:"Progress",


        bulan:"Januari"



    }];






    let ws=XLSX.utils.json_to_sheet(data);



    let wb=XLSX.utils.book_new();




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

"IMS JS V5 PART 3 READY"

);
// ========================================
// IMS MANAGEMENT SYSTEM V5
// API.JS V3 COMPATIBLE
// PART 4
// FINAL SYSTEM + REALTIME + AUTO SYNC
// ========================================


// ========================================
// SYSTEM STATE
// ========================================

let IMS_SYSTEM_READY = false;

let IMS_TIMER = null;








// ========================================
// INIT IMS SYSTEM
// ========================================


async function initIMSSystem(){


    try{


        console.log(

        "START IMS SYSTEM"

        );



        await checkIMSAPI();



        await refreshIMSData();



        startIMSRealtime();



        IMS_SYSTEM_READY=true;



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
// CHECK API IMS
// ========================================


async function checkIMSAPI(){



    try{



        let result = await apiRequest(

            "test",

            {}

        );




        if(result.success){



            console.log(

            "IMS API ONLINE"

            );



        }



        return result;



    }



    catch(e){



        console.error(

        "IMS API ERROR",

        e

        );


        return false;


    }



}









// ========================================
// REALTIME IMS
// ========================================


function startIMSRealtime(){



    stopIMSRealtime();




    IMS_TIMER=setInterval(()=>{


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
// SYNC IMS DONE
// ========================================


async function syncIMSData(){



    try{



        await refreshIMSData();



        if(typeof loadDashboard==="function"){


            await loadDashboard();


        }



        console.log(

        "IMS SYNC COMPLETE"

        );



    }



    catch(e){



        console.error(

        "IMS SYNC ERROR",

        e

        );


    }



}









// ========================================
// GET ALL IMS
// ========================================


async function getAllIMSData(){



    let result=[];



    let page=1;




    while(true){



        let response = await apiRequest(

            "getIMS",

            {

                page:page,

                limit:100

            }

        );




        if(

            !response.success

            ||

            !response.data

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
// BACKUP IMS EXCEL FULL
// ========================================


async function backupIMSExcel(){



    let data = await getAllIMSData();





    if(typeof XLSX==="undefined"){



        alert(

        "Excel library belum aktif"

        );


        return;


    }







    let ws = XLSX.utils.json_to_sheet(

        data

    );





    let wb = XLSX.utils.book_new();





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
// DELETE MULTI IMS
// ========================================


async function deleteMultipleIMS(ids){



    if(!Array.isArray(ids)){



        return;



    }







    for(let id of ids){



        await deleteIMSAPI(

            id

        );



    }






    await refreshIMSData();



}









// ========================================
// CHECK DUPLICATE IMS
// ========================================


function checkDuplicateIMS(ref){



    return imsData.some(item=>{


        return String(

            item.reference_code

        )

        ===

        String(ref);



    });



}









// ========================================
// PRINT IMS
// ========================================


function printIMS(){



    window.print();



}









// ========================================
// KEYBOARD SHORTCUT
// ========================================


document.addEventListener(

"keydown",

(e)=>{



    if(

        e.ctrlKey

        &&

        e.key==="r"

    ){



        e.preventDefault();



        refreshIMSData();



    }



});









// ========================================
// AUTO STOP
// ========================================


window.addEventListener(

"beforeunload",

()=>{



    stopIMSRealtime();



});









// ========================================
// START
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{



    initIMSSystem();



});









console.log(

"IMS JS V5 FINAL COMPLETE"

);
