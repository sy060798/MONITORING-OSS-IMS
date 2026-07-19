// ========================================
// OSS MANAGEMENT SYSTEM V5
// PART 1/5
// API.JS V3 COMPATIBLE
// GLOBAL + LOAD + DISPLAY
// ========================================


// ========================================
// GLOBAL STATE
// ========================================

let OSS_DATA = [];

let OSS_EDIT_ID = null;

let OSS_PAGE = 1;

let OSS_LIMIT = 100;

let OSS_TOTAL = 0;

let OSS_REFRESH_TIMER = null;

let OSS_READY = false;





// ========================================
// LOAD OSS DATA FROM API
// ========================================

async function loadOSS(){


    try{


        showLoadingOSS(true);



        const response = await apiRequest(

            "getOSS",

            {

                page: OSS_PAGE,

                limit: OSS_LIMIT

            }

        );



        console.log(

            "OSS API RESPONSE",

            response

        );





        if(

            !response ||

            response.success !== true

        ){


            throw new Error(

                response.message ||

                "Gagal mengambil data OSS"

            );


        }







        OSS_DATA =

        Array.isArray(response.data)

        ?

        response.data

        :

        [];







        OSS_TOTAL =

        response.total ||

        OSS_DATA.length;







        renderOSS(

            OSS_DATA

        );







        updateTotalOSS();







        if(

            typeof updateOSSDashboard === "function"

        ){


            updateOSSDashboard();


        }






    }


    catch(error){



        console.error(

            "LOAD OSS ERROR",

            error

        );



        renderOSS([]);




    }


    finally{



        showLoadingOSS(false);



    }



}









// ========================================
// RENDER TABLE OSS
// ========================================

function renderOSS(data){



    const tbody = document.getElementById(

        "ossData"

    );




    if(!tbody){

        console.warn(

            "Element ossData tidak ditemukan"

        );

        return;

    }






    if(

        !data ||

        data.length===0

    ){



        tbody.innerHTML = `


        <tr>


        <td colspan="5">


        Belum ada data OSS


        </td>


        </tr>


        `;


        return;


    }







    let html = "";







    data.forEach((item,index)=>{



        html += `



        <tr>



            <td>

            ${item.reference_code || "-"}

            </td>





            <td>

            ${item.cust_id || "-"}

            </td>





            <td>

            ${item.customer || "-"}

            </td>





            <td>

            ${item.city || "-"}

            </td>






            <td>


                <button

                class="btn btn-warning"

                onclick="editOSS(${index})">


                ✏ Edit


                </button>





                <button

                class="btn btn-danger"

                onclick="removeOSS(${index})">


                🗑 Hapus


                </button>



            </td>




        </tr>



        `;



    });







    tbody.innerHTML = html;



}









// ========================================
// UPDATE CARD TOTAL OSS
// ========================================

function updateTotalOSS(){



    const el = document.getElementById(

        "totalOSS"

    );




    if(el){


        el.innerText =

        OSS_TOTAL +

        " Data";


    }



}









// ========================================
// LOADING STATUS
// ========================================

function showLoadingOSS(state){



    const el = document.getElementById(

        "loadingOSS"

    );




    if(!el){

        return;

    }







    if(state){


        el.innerText =

        "⏳ Loading OSS...";


    }

    else{


        el.innerText =

        "🟢 OSS Ready";


    }



}









// ========================================
// CHECK API OSS
// ========================================

async function checkOSSAPI(){



    try{


        const result = await apiRequest(

            "test",

            {}

        );



        console.log(

            "OSS API CHECK",

            result

        );



        return result;



    }


    catch(error){


        console.error(

            "OSS API ERROR",

            error

        );



        return {


            success:false


        };

    }



}









// ========================================
// INIT OSS BASIC
// ========================================

async function initOSS(){



    try{



        console.log(

            "START OSS SYSTEM V5"

        );




        let api = await checkOSSAPI();




        if(!api.success){


            throw new Error(

                "API OSS Offline"

            );


        }






        await loadOSS();





        OSS_READY = true;





        console.log(

            "OSS SYSTEM READY"

        );



    }


    catch(error){



        console.error(

            "OSS INIT ERROR",

            error

        );


    }



}









// ========================================
// AUTO START
// ========================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    initOSS();


});









console.log(

"OSS JS V5 PART 1 READY"

);
// ========================================
// OSS MANAGEMENT SYSTEM V5
// PART 2/5
// CRUD + MODAL + FORM
// API.JS V3 COMPATIBLE
// ========================================


// ========================================
// SAVE OSS
// ========================================

async function saveOSS(){



    let data={



        reference_code:

        getInputOSS(
            "referenceCode"
        ),



        cust_id:

        getInputOSS(
            "custID"
        ),



        customer:

        getInputOSS(
            "customer"
        ),



        city:

        getInputOSS(
            "city"
        )



    };







    if(!data.reference_code){



        alert(

            "Reference Code wajib diisi"

        );


        return;


    }









    try{



        let result;






        if(OSS_EDIT_ID){



            result = await apiRequest(

                "updateOSS",

                {


                    id:OSS_EDIT_ID,


                    ...data


                }

            );



        }

        else{



            result = await apiRequest(

                "addOSS",

                data

            );



        }







        console.log(

            "SAVE OSS RESULT",

            result

        );








        if(result.success){



            alert(

                "Data OSS berhasil disimpan"

            );




            closeOSS();




            resetOSSForm();




            OSS_PAGE=1;




            await loadOSS();





            if(

                typeof loadDashboard==="function"

            ){


                await loadDashboard();


            }



        }








    }


    catch(error){



        console.error(

            "SAVE OSS ERROR",

            error

        );



        alert(

            "Gagal menyimpan OSS"

        );



    }



}









// ========================================
// EDIT OSS
// ========================================

function editOSS(index){



    let item = OSS_DATA[index];



    if(!item){

        return;

    }





    OSS_EDIT_ID = item.id;







    setInputOSS(

        "referenceCode",

        item.reference_code

    );





    setInputOSS(

        "custID",

        item.cust_id

    );





    setInputOSS(

        "customer",

        item.customer

    );





    setInputOSS(

        "city",

        item.city

    );







    let title = document.getElementById(

        "ossModalTitle"

    );



    if(title){


        title.innerText =

        "Edit Data OSS";


    }







    openAddOSS();



}









// ========================================
// DELETE OSS
// ========================================

async function removeOSS(index){



    let item = OSS_DATA[index];



    if(!item){

        return;

    }







    if(

        !confirm(

            "Hapus data OSS?"

        )

    ){


        return;


    }








    try{



        let result = await apiRequest(

            "deleteOSS",

            {


                id:item.id


            }

        );






        console.log(

            "DELETE OSS",

            result

        );








        if(result.success){



            alert(

                "OSS berhasil dihapus"

            );





            await loadOSS();





            if(

                typeof loadDashboard==="function"

            ){



                await loadDashboard();



            }




        }







    }


    catch(error){



        console.error(

            "DELETE OSS ERROR",

            error

        );



        alert(

            "Gagal hapus OSS"

        );



    }





}









// ========================================
// OPEN ADD MODAL
// ========================================

function openAddOSS(){



    let modal=document.getElementById(

        "modalOSS"

    );





    if(modal){



        modal.style.display="flex";



    }



}









// ========================================
// CLOSE MODAL
// ========================================

function closeOSS(){



    let modal=document.getElementById(

        "modalOSS"

    );





    if(modal){



        modal.style.display="none";



    }




}









// ========================================
// RESET FORM
// ========================================

function resetOSSForm(){



    OSS_EDIT_ID=null;






    [

        "referenceCode",

        "custID",

        "customer",

        "city"


    ]

    .forEach(id=>{



        setInputOSS(

            id,

            ""

        );



    });






    let title=document.getElementById(

        "ossModalTitle"

    );



    if(title){


        title.innerText =

        "Tambah Data OSS";


    }



}









// ========================================
// INPUT HELPER
// ========================================

function getInputOSS(id){



    let el=document.getElementById(

        id

    );



    return el

    ?

    el.value.trim()

    :

    "";



}









function setInputOSS(id,value){



    let el=document.getElementById(

        id

    );



    if(el){



        el.value =

        value || "";



    }



}









// ========================================
// QUICK ADD RESET
// ========================================

function newOSS(){



    resetOSSForm();



    openAddOSS();



}









console.log(

"OSS JS V5 PART 2 READY"

);
// ========================================
// OSS MANAGEMENT SYSTEM V6
// PART 3
// EXCEL + PAGINATION + IMPORT EXPORT
// API.JS V3 COMPATIBLE
// ========================================


// ========================================
// PAGINATION
// ========================================

function nextOSSPage(){

    let maxPage = Math.ceil(
        OSS_TOTAL / OSS_LIMIT
    );


    if(OSS_PAGE < maxPage){

        OSS_PAGE++;

        loadOSS();

    }

}



function prevOSSPage(){

    if(OSS_PAGE > 1){

        OSS_PAGE--;

        loadOSS();

    }

}





function renderOSSPagination(){

    let el=document.getElementById(
        "ossPagination"
    );


    if(!el)return;



    let totalPage=Math.ceil(
        OSS_TOTAL / OSS_LIMIT
    );



    el.innerHTML=`

        <button 
        class="btn"
        onclick="prevOSSPage()">

        ◀

        </button>


        <span>

        Page ${OSS_PAGE} / ${totalPage || 1}

        </span>


        <button 
        class="btn"
        onclick="nextOSSPage()">

        ▶

        </button>

    `;

}







// ========================================
// REFRESH OSS
// ========================================

async function refreshOSS(){

    OSS_PAGE=1;

    await loadOSS();

}







// ========================================
// OPEN UPLOAD MODAL
// HTML BUTTON
// onclick="openUploadOSS()"
// ========================================


function openUploadOSS(){

    let modal =
    document.getElementById(
        "uploadOSSModal"
    );


    if(modal){

        modal.style.display="flex";

    }

}






function closeUploadOSS(){

    let modal =
    document.getElementById(
        "uploadOSSModal"
    );


    if(modal){

        modal.style.display="none";

    }


}









// ========================================
// IMPORT EXCEL OSS
// ========================================

function importOSSExcel(file){



    if(
        typeof XLSX==="undefined"
    ){

        alert(
            "Library Excel belum aktif"
        );

        return;

    }




    let reader =
    new FileReader();





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



        console.log(
            "IMPORT OSS EXCEL",
            rows
        );





        if(
            rows.length===0
        ){

            alert(
                "Excel kosong"
            );

            return;

        }






        bulkOSSAPI(rows)

        .then(result=>{


            console.log(
                "BULK OSS RESULT",
                result
            );



            if(result.success){


                alert(
                    result.message
                );


                closeUploadOSS();


                loadOSS();



            }


        });



    };





    reader.readAsArrayBuffer(file);



}









// ========================================
// BULK API
// ========================================

async function bulkOSSAPI(rows){


    return await apiRequest(

        "bulkOSS",

        rows

    );


}









// ========================================
// BUTTON UPLOAD HTML
// onclick="uploadOSS()"
// ========================================


function uploadOSS(){



    let input =
    document.getElementById(
        "excelOSS"
    );



    if(
        !input ||
        input.files.length===0
    ){


        alert(
            "Pilih file Excel OSS"
        );


        return;

    }





    importOSSExcel(
        input.files[0]
    );


}









// ========================================
// EXPORT EXCEL
// ========================================

function exportOSSExcel(){



    if(
        typeof XLSX==="undefined"
    ){

        alert(
            "Excel library belum aktif"
        );

        return;

    }





    let exportData =
    OSS_DATA.map(item=>({



        Reference_Code:
        item.reference_code || "",



        Cust_ID:
        item.cust_id || "",



        Customer:
        item.customer || "",



        City:
        item.city || "",



        Status:
        item.status || ""



    }));







    let ws =
    XLSX.utils.json_to_sheet(
        exportData
    );




    let wb =
    XLSX.utils.book_new();





    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "OSS"

    );





    XLSX.writeFile(

        wb,

        "DATA_OSS.xlsx"

    );


}









// ========================================
// TEMPLATE EXCEL
// ========================================

function downloadOSSTemplate(){



    if(
        typeof XLSX==="undefined"
    ){

        return;

    }






    let template=[{


        reference_code:
        "REF001",


        cust_id:
        "C001",


        customer:
        "Customer Example",


        city:
        "Jakarta"


    }];





    let ws =
    XLSX.utils.json_to_sheet(
        template
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

        "TEMPLATE_OSS.xlsx"

    );


}









// ========================================
// BACKUP ALL DATA
// ========================================

async function backupOSS(){


    let all=[];

    let page=1;




    while(true){


        let res =
        await apiRequest(

            "getOSS",

            {

                page:page,

                limit:100

            }

        );



        if(
            !res.success ||
            !res.data ||
            res.data.length===0
        ){

            break;

        }




        all.push(
            ...res.data
        );


        page++;


    }






    let ws =
    XLSX.utils.json_to_sheet(
        all
    );



    let wb =
    XLSX.utils.book_new();




    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "BACKUP OSS"

    );




    XLSX.writeFile(

        wb,

        "BACKUP_OSS.xlsx"

    );



}







console.log(
"OSS JS V6 PART 3 READY"
);
// ========================================
// OSS MANAGEMENT SYSTEM V6
// PART 4
// REALTIME + DASHBOARD SYNC
// API.JS V3 COMPATIBLE
// ========================================



// ========================================
// SYSTEM STATE
// ========================================

let OSS_SYSTEM_READY = false;

let OSS_REFRESH_TIMER = null;





// ========================================
// START OSS SYSTEM
// ========================================

async function startOSSSystem(){


    try{


        console.log(
            "START OSS SYSTEM V6"
        );



        let api =
        await apiRequest(

            "test",

            {}

        );



        if(
            !api ||
            api.success !== true
        ){

            throw new Error(
                "API OSS tidak aktif"
            );

        }





        await loadOSS();



        await syncOSSDashboard();



        startOSSRealtime();



        OSS_SYSTEM_READY=true;



        console.log(
            "OSS SYSTEM V6 READY"
        );



    }


    catch(error){


        console.error(

            "OSS SYSTEM ERROR",

            error

        );


        let loading =
        document.getElementById(
            "loadingOSS"
        );


        if(loading){

            loading.innerHTML=
            "🔴 API ERROR";

        }


    }


}









// ========================================
// REALTIME TIMER
// ========================================

function startOSSRealtime(){


    stopOSSRealtime();



    OSS_REFRESH_TIMER =
    setInterval(async()=>{


        console.log(
            "OSS AUTO SYNC"
        );



        await loadOSS();



        await syncOSSDashboard();



    },30000);



}









function stopOSSRealtime(){


    if(
        OSS_REFRESH_TIMER
    ){


        clearInterval(
            OSS_REFRESH_TIMER
        );



        OSS_REFRESH_TIMER=null;


    }


}









// ========================================
// DASHBOARD SYNC
// ========================================

async function syncOSSDashboard(){


    try{


        let result =
        await apiRequest(

            "getDashboard",

            {}

        );



        console.log(

            "DASHBOARD OSS SYNC",

            result

        );




        if(
            !result ||
            result.success!==true
        ){

            return;

        }







        updateDashboardOSS(

            result.data

        );



    }


    catch(error){


        console.error(

            "SYNC DASHBOARD ERROR",

            error

        );


    }


}









// ========================================
// UPDATE CARD DASHBOARD
// ========================================

function updateDashboardOSS(data){



    if(!data)
    return;



    // CARD TOTAL OSS


    let total =
    document.getElementById(
        "totalOSS"
    );



    if(total){


        total.innerHTML =
        data.totalOSS || 0;


    }





    // DASHBOARD PAGE


    let dashTotal =
    document.getElementById(
        "dashboardTotalOSS"
    );



    if(dashTotal){


        dashTotal.innerHTML =
        data.totalOSS || 0;


    }



}









// ========================================
// LOAD ALL OSS DATA
// UNTUK DASHBOARD
// ========================================

async function getAllOSSData(){



    let result=[];


    let page=1;




    while(true){



        let response =
        await apiRequest(

            "getOSS",

            {

                page:page,

                limit:100

            }

        );



        if(
            !response.success ||
            !response.data ||
            response.data.length===0
        ){

            break;

        }





        result.push(
            ...response.data
        );



        page++;


    }




    return result;



}









// ========================================
// STATISTIK OSS
// ========================================

function calculateOSSStatistic(){



    let total =
    OSS_DATA.length;



    let active =
    OSS_DATA.filter(item=>{


        return item.status !== "DELETE";


    }).length;





    return {


        total:total,


        active:active


    };


}









// ========================================
// PRINT OSS
// ========================================

function printOSS(){


    window.print();


}









// ========================================
// KEYBOARD SHORTCUT
// ========================================

document.addEventListener(

"keydown",

function(e){



    if(
        e.ctrlKey &&
        e.key==="r"
    ){



        e.preventDefault();



        refreshOSS();



    }



});









// ========================================
// CLEAN TIMER
// ========================================

window.addEventListener(

"beforeunload",

()=>{


    stopOSSRealtime();


}

);









// ========================================
// AUTO START
// ========================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    startOSSSystem();



});








console.log(
"OSS JS V6 PART 4 READY"
);
// ========================================
// OSS MANAGEMENT SYSTEM V6
// PART 5 FINAL
// FULL TOOLBAR + MASTER + DASHBOARD SYNC
// API.JS V3 COMPATIBLE
// ========================================



// ========================================
// FINAL TOOLBAR HANDLER
// ========================================


// tombol:
// onclick="openAddOSS()"

function openAddOSS(){


    OSS_EDIT_ID=null;


    resetOSSForm();



    let title =
    document.getElementById(
        "ossModalTitle"
    );


    if(title){

        title.innerHTML=
        "Tambah Data OSS";

    }





    let modal =
    document.getElementById(
        "modalOSS"
    );


    if(modal){

        modal.style.display="flex";

    }


}







// ========================================
// CLOSE MODAL FINAL
// ========================================

function closeOSS(){


    let modal =
    document.getElementById(
        "modalOSS"
    );


    if(modal){

        modal.style.display="none";

    }



}









// ========================================
// EDIT FINAL
// ========================================

function editOSS(index){



    let item =
    OSS_DATA[index];



    if(!item)
    return;




    OSS_EDIT_ID =
    item.id;




    setInputOSS(

        "referenceCode",

        item.reference_code

    );



    setInputOSS(

        "custID",

        item.cust_id

    );



    setInputOSS(

        "customer",

        item.customer

    );



    setInputOSS(

        "city",

        item.city

    );





    let title =
    document.getElementById(
        "ossModalTitle"
    );


    if(title){

        title.innerHTML=
        "Edit Data OSS";

    }






    let modal =
    document.getElementById(
        "modalOSS"
    );


    if(modal){

        modal.style.display="flex";

    }



}









// ========================================
// DELETE FINAL
// ========================================

async function removeOSS(index){



    let item =
    OSS_DATA[index];



    if(!item)
    return;




    let confirmDelete =
    confirm(
        "Hapus data OSS?"
    );



    if(!confirmDelete)
    return;





    try{


        let result =
        await apiRequest(

            "deleteOSS",

            {

                id:item.id

            }

        );





        if(result.success){


            await loadOSS();


            await syncOSSDashboard();



        }



    }


    catch(error){


        console.error(

            "DELETE OSS ERROR",

            error

        );


        alert(
            "Gagal hapus OSS"
        );


    }


}









// ========================================
// RESET FORM FINAL
// ========================================

function resetOSSForm(){



    OSS_EDIT_ID=null;




    [

        "referenceCode",

        "custID",

        "customer",

        "city"


    ]

    .forEach(id=>{


        let el =
        document.getElementById(id);



        if(el){

            el.value="";

        }


    });



}









// ========================================
// MASTER MONITORING SYNC
// ========================================

async function syncMasterOSS(){



    try{


        let result =
        await apiRequest(

            "getMaster",

            {}

        );



        console.log(

            "MASTER OSS SYNC",

            result

        );





        if(
            result.success
        ){


            window.MASTER_DATA =
            result.data;



        }



    }


    catch(error){


        console.error(

            "MASTER SYNC ERROR",

            error

        );


    }


}









// ========================================
// FULL SYSTEM REFRESH
// ========================================

async function refreshOSSSystem(){



    try{


        showLoadingOSS(true);



        await loadOSS();



        await syncOSSDashboard();



        await syncMasterOSS();





    }


    catch(error){


        console.error(

            "FULL OSS REFRESH ERROR",

            error

        );


    }


    finally{


        showLoadingOSS(false);


    }



}









// ========================================
// API CONNECTION MONITOR
// ========================================

async function checkOSSConnection(){



    try{


        let result =
        await apiRequest(

            "test",

            {}

        );




        if(
            result.success
        ){


            console.log(
                "OSS API ONLINE"
            );


            return true;


        }


    }


    catch(e){



        console.error(
            "OSS API OFFLINE"
        );



    }




    return false;



}









// ========================================
// SAFE API WRAPPER
// ========================================

async function safeOSSRequest(
    action,
    data={}
){


    try{


        let result =
        await apiRequest(

            action,

            data

        );



        if(
            !result.success
        ){


            throw new Error(
                result.message
            );


        }



        return result;



    }


    catch(error){


        console.error(

            "SAFE OSS API ERROR",

            error

        );


        return {

            success:false,

            message:error.message

        };


    }



}









// ========================================
// GLOBAL REFRESH BUTTON SUPPORT
// ========================================

window.refreshOSS =
refreshOSSSystem;





// ========================================
// EXPORT GLOBAL
// AGAR HTML BISA PANGGIL
// ========================================

window.openAddOSS =
openAddOSS;


window.openUploadOSS =
openUploadOSS;


window.closeUploadOSS =
closeUploadOSS;


window.saveOSS =
saveOSS;


window.editOSS =
editOSS;


window.removeOSS =
removeOSS;


window.searchOSS =
searchOSS;


window.uploadOSS =
uploadOSS;


window.exportOSSExcel =
exportOSSExcel;


window.downloadOSSTemplate =
downloadOSSTemplate;








// ========================================
// FINAL START
// ========================================

window.addEventListener(

"load",

async()=>{


    console.log(
        "OSS FINAL CHECK"
    );



    let online =
    await checkOSSConnection();



    if(online){


        await syncOSSDashboard();


        await syncMasterOSS();


    }



});






console.log(
"OSS JS V6 PART 5 FINAL READY"
);
