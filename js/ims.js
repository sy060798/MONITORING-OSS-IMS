// ========================================
// IMS MANAGEMENT SYSTEM V6
// API JS V4 COMPATIBLE
// PART 1
// CORE + DATA LOADER + CRUD CORE
// ========================================


// ========================================
// GLOBAL STATE
// ========================================

let IMS_DATA = [];

let IMS_EDIT_ID = null;

let IMS_PAGE = 1;

let IMS_LIMIT = 100;

let IMS_TOTAL = 0;


let IMS_SYSTEM_STATUS = {

    online:false,

    lastSync:null,

    loadTime:0,

    totalData:0

};






// ========================================
// LOADING IMS STATUS
// ========================================

function showLoadingIMS(state){


    let el=document.getElementById(
        "imsLoading"
    );


    if(!el){
        return;
    }


    el.innerText = state

    ? "⏳ Loading IMS..."

    : "🟢 IMS Ready";


}









// ========================================
// LOAD IMS DATA
// ========================================

async function loadIMS(){


    let startTime = performance.now();



    try{


        showLoadingIMS(true);



        let result = await apiRequest(

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

                result?.message

                ||

                "Gagal mengambil data IMS"

            );

        }






        let data = result.data || [];





        if(!Array.isArray(data)){


            data=[];


        }






        IMS_DATA = data;



        IMS_TOTAL = IMS_DATA.length;






        IMS_SYSTEM_STATUS.online=true;


        IMS_SYSTEM_STATUS.lastSync=

        new Date()

        .toLocaleString(

            "id-ID"

        );



        IMS_SYSTEM_STATUS.loadTime=

        (

            performance.now()

            -

            startTime

        ).toFixed(2);



        IMS_SYSTEM_STATUS.totalData=

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



        IMS_SYSTEM_STATUS.online=false;



        IMS_DATA=[];



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



    let table = document.getElementById(

        "imsData"

    );



    if(!table){

        return;

    }






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


            resetIMSForm();


            await loadIMS();


        }





    }


    catch(error){



        console.error(

            "SAVE IMS ERROR",

            error

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



    if(!item){

        return;

    }





    IMS_EDIT_ID=item.id;




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




    if(typeof openAddIMS==="function"){

        openAddIMS();

    }



}









// ========================================
// DELETE IMS
// ========================================

async function removeIMS(index){



    let item = IMS_DATA[index];



    if(!item){

        return;

    }




    if(!confirm(

        "Hapus data IMS?"

    )){

        return;

    }







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


    return el

    ?

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







console.log(

"IMS JS V6 PART 1 READY"

);
// ========================================
// IMS MANAGEMENT SYSTEM V6
// API JS V4 COMPATIBLE
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
// FILTER IMS
// ========================================

function filterIMS(){



    let status = getValueIMS(

        "statusFilter"

    );



    let bulan = getValueIMS(

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
// GENERATE MONTH FILTER
// ========================================

function generateMonthFilterIMS(){



    let select=document.getElementById(

        "monthFilterIMS"

    );



    if(!select){

        return;

    }






    let bulanList=[

        ...

        new Set(

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






    bulanList.forEach(bulan=>{



        if(bulan){


            html+=`

            <option value="${bulan}">

            ${bulan}

            </option>


            `;


        }



    });







    select.innerHTML=html;



}









// ========================================
// SUMMARY IMS
// ========================================

function getIMSSummary(){



    let total = IMS_DATA.length;





    let progress = IMS_DATA.filter(x=>


        x.status==="Progress"


    ).length;






    let selesai = IMS_DATA.filter(x=>


        x.status==="Done"

        ||

        x.status==="Closed"

        ||

        x.status==="Approved"


    ).length;







    let revisi = IMS_DATA.filter(x=>


        x.status==="Revisi"


    ).length;







    let belum = IMS_DATA.filter(x=>


        !x.status

        ||

        x.status==="Belum"


    ).length;







    return {


        total,

        progress,

        selesai,

        revisi,

        belum



    };



}









// ========================================
// UPDATE IMS COUNTER
// ========================================

function updateTotalIMS(){



    let data=getIMSSummary();






    let el=document.getElementById(

        "totalIMS"

    );



    if(el){


        el.innerText=

        data.total+" Data";


    }






    let done=document.getElementById(

        "doneIMS"

    );



    if(done){


        done.innerText=

        data.selesai;


    }







    let progress=document.getElementById(

        "progressIMS"

    );



    if(progress){


        progress.innerText=

        data.progress;


    }







    let revisi=document.getElementById(

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
// EXPORT IMS EXCEL
// ========================================

function exportIMSExcel(){



    if(typeof XLSX==="undefined"){


        alert(

        "Library Excel belum aktif"

        );


        return;


    }







    let rows = IMS_DATA.map(item=>({



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







    let ws=XLSX.utils.json_to_sheet(

        rows

    );





    let wb=XLSX.utils.book_new();






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
// IMPORT IMS EXCEL
// ========================================

function importIMSExcel(file){



    if(!file){

        return;

    }






    if(typeof XLSX==="undefined"){


        alert(

        "Library Excel belum aktif"

        );


        return;


    }








    let reader=new FileReader();






    reader.onload=function(e){



        let workbook=XLSX.read(

            new Uint8Array(

                e.target.result

            ),

            {

                type:"array"

            }

        );







        let sheet=workbook.Sheets[

            workbook.SheetNames[0]

        ];







        let rows=XLSX.utils.sheet_to_json(

            sheet

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
// TEMPLATE EXCEL
// ========================================

function downloadIMSTemplate(){



    if(typeof XLSX==="undefined"){

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







    let ws=XLSX.utils.json_to_sheet(

        data

    );






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

"IMS JS V6 PART 2 READY"

);
// ========================================
// IMS MANAGEMENT SYSTEM V6
// API JS V4 COMPATIBLE
// PART 3
// DASHBOARD CONNECT + SYNC + PAGINATION
// ========================================


// ========================================
// UPDATE DASHBOARD CONNECTION
// ========================================

function updateIMSDashboard(){


    let data = getIMSSummary();





    let total = document.getElementById(

        "totalIMS"

    );



    if(total){

        total.innerText = data.total;

    }






    let progress = document.getElementById(

        "progress"

    );



    if(progress){

        progress.innerText=data.progress;

    }







    let revisi = document.getElementById(

        "revisi"

    );



    if(revisi){

        revisi.innerText=data.revisi;

    }







    let selesai = document.getElementById(

        "selesai"

    );



    if(selesai){

        selesai.innerText=data.selesai;

    }



}









// ========================================
// GET IMS DATA FOR DASHBOARD
// ========================================

function getIMSDataSummary(){



    return {


        total:

        IMS_DATA.length,



        progress:

        IMS_DATA.filter(x=>

            x.status==="Progress"

        ).length,



        revisi:

        IMS_DATA.filter(x=>

            x.status==="Revisi"

        ).length,



        selesai:

        IMS_DATA.filter(x=>

            x.status==="Done"

            ||

            x.status==="Closed"

            ||

            x.status==="Approved"

        ).length,



        belum:

        IMS_DATA.filter(x=>

            !x.status

        ).length



    };


}









// ========================================
// SYNC KE DASHBOARD
// ========================================

async function syncIMSData(){



    try{



        await loadIMS();




        if(typeof loadDashboard==="function"){



            await loadDashboard();



        }





        console.log(

        "IMS DASHBOARD SYNC OK"

        );



    }



    catch(error){



        console.error(

        "IMS DASHBOARD SYNC ERROR",

        error

        );



    }



}









// ========================================
// PAGINATION
// ========================================

function nextIMSPage(){



    let maxPage=Math.ceil(

        IMS_TOTAL /

        IMS_LIMIT

    );





    if(IMS_PAGE < maxPage){



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



    let el=document.getElementById(

        "imsPagination"

    );



    if(!el){

        return;

    }







    let totalPage=Math.ceil(

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
// FULL LOAD IMS
// ========================================

async function refreshIMSData(){



    let start=performance.now();



    try{



        showLoadingIMS(true);





        await loadIMS();





        updateIMSDashboard();





        IMS_SYSTEM_STATUS.loadTime=

        (

            performance.now()

            -

            start

        ).toFixed(2);






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
// GET ALL IMS DATA
// ========================================

async function getAllIMSData(){



    let result=[];



    let page=1;






    while(true){



        let response = await apiRequest(

            "getIMS",

            {

                page,

                limit:100

            }

        );






        if(

            !response.success

            ||

            !Array.isArray(response.data)

        ){



            break;


        }







        if(response.data.length===0){



            break;



        }






        result.push(

            ...response.data

        );







        if(response.data.length < 100){



            break;



        }





        page++;



    }







    return result;



}









// ========================================
// DUPLICATE CHECK
// ========================================

function checkDuplicateIMS(ref){



    return IMS_DATA.some(item=>{


        return String(

            item.reference_code

        )

        ===

        String(ref);



    });



}









// ========================================
// DELETE MULTIPLE IMS
// ========================================

async function deleteMultipleIMS(ids){



    if(!Array.isArray(ids)){



        return;



    }






    for(let id of ids){



        await apiRequest(

            "deleteIMS",

            {

                id:id

            }

        );



    }







    await loadIMS();



}









// ========================================
// PRINT IMS
// ========================================

function printIMS(){



    window.print();



}








console.log(

"IMS JS V6 PART 3 READY"

);

// ========================================
// IMS MANAGEMENT SYSTEM V6
// API JS V4 COMPATIBLE
// PART 4A
// FINAL SYSTEM + REALTIME + AUTO SYNC
// ========================================


// ========================================
// SYSTEM STATE
// ========================================

let IMS_SYSTEM_READY = false;

let IMS_TIMER = null;

let IMS_LAST_UPDATE = null;

let IMS_API_STATUS = false;






// ========================================
// INIT IMS SYSTEM
// ========================================

async function initIMSSystem(){


    try{


        console.log(
            "START IMS SYSTEM V6"
        );



        await checkIMSAPI();



        await refreshIMSData();




        startIMSRealtime();




        IMS_SYSTEM_READY = true;



        updateIMSSystemStatus();



        console.log(
            "IMS SYSTEM V6 READY"
        );



    }


    catch(error){


        console.error(
            "IMS INIT ERROR",
            error
        );


        IMS_API_STATUS=false;


        updateIMSSystemStatus();



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




        IMS_API_STATUS =

        result.success === true;





        if(IMS_API_STATUS){


            console.log(
                "IMS API ONLINE"
            );


        }

        else{


            console.warn(
                "IMS API OFFLINE"
            );


        }





        return result;



    }


    catch(error){


        IMS_API_STATUS=false;


        console.error(
            "IMS API CHECK ERROR",
            error
        );


        return {

            success:false

        };


    }


}








// ========================================
// LOADING HANDLER
// ========================================

function showLoadingIMS(state){


    let el = document.getElementById(
        "imsLoading"
    );



    if(!el){

        return;

    }





    if(state){


        el.innerText =
        "⏳ Memuat data IMS...";


    }

    else{


        el.innerText =
        "🟢 Data IMS terbaru";


    }



}








// ========================================
// UPDATE SYSTEM STATUS
// ========================================

function updateIMSSystemStatus(){


    let api =
    document.getElementById(
        "apiStatus"
    );



    if(api){


        api.innerHTML = IMS_API_STATUS

        ?

        "🟢 API Online"

        :

        "🔴 API Offline";


    }






    let update =
    document.getElementById(
        "imsLastUpdate"
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
// REFRESH IMS DATA
// ========================================

async function refreshIMSData(){


    try{


        showLoadingIMS(true);



        const response = await apiRequest(

            "getIMS",

            {

                page:1,

                limit:10000

            }

        );






        if(

            !response

            ||

            !response.success

        ){


            throw new Error(

                response.message ||

                "Gagal mengambil data IMS"

            );


        }





        IMS_DATA =

        Array.isArray(response.data)

        ?

        response.data

        :

        [];







        IMS_TOTAL = IMS_DATA.length;






        renderIMS(

            IMS_DATA

        );





        updateTotalIMS();



        updateIMSDashboard();



        generateMonthFilterIMS();



        updateIMSInfo();



        IMS_LAST_UPDATE = new Date();



        IMS_API_STATUS=true;



        updateIMSSystemStatus();




    }


    catch(error){



        console.error(

            "REFRESH IMS ERROR",

            error

        );



        IMS_API_STATUS=false;



        updateIMSSystemStatus();



        renderIMS([]);



    }



    finally{


        showLoadingIMS(false);



    }



}









// ========================================
// GET ALL IMS VALID DATA
// ========================================

async function getAllIMSData(){


    try{


        let response = await apiRequest(

            "getIMS",

            {

                page:1,

                limit:10000

            }

        );



        if(

            response.success

            &&

            Array.isArray(response.data)

        ){


            return response.data;


        }



        return [];



    }


    catch(error){


        console.error(

            "GET ALL IMS ERROR",

            error

        );


        return [];

    }


}









// ========================================
// SUMMARY IMS REAL DATA
// ========================================

function getIMSSummary(){


    let data = Array.isArray(

        IMS_DATA

    )

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

            x.status==="Done"

            ||

            x.status==="Closed"

            ||

            x.status==="Approved"

        ).length,





        belum:

        data.filter(x=>

            !x.status

        ).length



    };

}









console.log(

"IMS JS V6 PART 4A READY"

);
 // ========================================
// IMS MANAGEMENT SYSTEM V6
// API JS V4 COMPATIBLE
// PART 4B
// REALTIME + SYNC + BACKUP + CLEANUP
// ========================================


// ========================================
// START REALTIME IMS
// ========================================

function startIMSRealtime(){


    stopIMSRealtime();




    IMS_TIMER = setInterval(()=>{


        refreshIMSData();



    },60000);



}








// ========================================
// STOP REALTIME IMS
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
// SYNC IMS TO DASHBOARD
// ========================================

async function syncIMSData(){


    try{


        await refreshIMSData();





        if(typeof loadDashboard==="function"){


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
// BACKUP IMS FULL
// ========================================

async function backupIMSExcel(){



    let data = await getAllIMSData();




    if(

        !data.length

    ){


        alert(

            "Tidak ada data IMS"

        );


        return;


    }





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
// DUPLICATE CHECK
// ========================================

function checkDuplicateIMS(reference){



    return IMS_DATA.some(item=>{


        return String(

            item.reference_code || ""

        )

        ===

        String(

            reference || ""

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
// CLEANUP
// ========================================

window.addEventListener(

"beforeunload",

()=>{



    stopIMSRealtime();



});









// ========================================
// AUTO START
// ========================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    initIMSSystem();



});









console.log(

"IMS JS V6 PART 4B READY"

);
