// ========================================
// OSS MANAGEMENT SYSTEM V6 UPDATE
// PART 1
// CORE DATA + LOAD + DISPLAY
// SAFE GLOBAL VERSION
// ========================================


// ========================================
// GLOBAL STATE SAFE
// ========================================

window.OSS_STATE =
window.OSS_STATE || {


    data: [],

    editID:null,

    page:1,

    limit:100,

    total:0,

    ready:false


};





// ========================================
// LOAD OSS DATA
// ========================================

async function loadOSS(){


    try{


        showLoadingOSS(true);



        let response =
        await apiRequest(

            "getOSS",

            {

                page:
                OSS_STATE.page,


                limit:
                OSS_STATE.limit

            }

        );





        console.log(

            "OSS RESPONSE",

            response

        );





        if(
            !response ||
            response.success!==true
        ){

            throw new Error(

                response.message ||
                "OSS API ERROR"

            );

        }





        OSS_STATE.data =
        response.data || [];





        OSS_STATE.total =
        OSS_STATE.data.length;






        renderOSS(

            OSS_STATE.data

        );





        updateTotalOSS();




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
// RENDER TABLE
// ========================================

function renderOSS(data){


    let html="";



    if(
        !data ||
        data.length===0
    ){


        html=`

        <tr>

        <td colspan="5">

        Data OSS kosong

        </td>

        </tr>

        `;


    }

    else{


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



    }





    let tbody =
    document.getElementById(

        "ossData"

    );




    if(tbody){


        tbody.innerHTML =
        html;


    }



}









// ========================================
// UPDATE TOTAL CARD
// ========================================

function updateTotalOSS(){


    let el =
    document.getElementById(

        "totalOSS"

    );



    if(el){


        el.innerHTML =
        OSS_STATE.total +
        " Data";


    }


}









// ========================================
// LOADING STATUS
// ========================================

function showLoadingOSS(status){


    let el =
    document.getElementById(

        "loadingOSS"

    );



    if(!el)
    return;




    el.innerHTML =

    status ?

    "⏳ Loading..." :

    "🟢 Ready";



}









// ========================================
// SEARCH OSS
// ========================================

function searchOSS(){



    let input =
    document.getElementById(

        "searchOSS"

    );



    let key =
    input ?

    input.value
    .toLowerCase()

    :

    "";





    let result =

    OSS_STATE.data.filter(item=>{


        return (

            String(
            item.reference_code || ""
            )
            .toLowerCase()
            .includes(key)


            ||

            String(
            item.customer || ""
            )
            .toLowerCase()
            .includes(key)


            ||

            String(
            item.city || ""
            )
            .toLowerCase()
            .includes(key)

        );


    });





    renderOSS(result);



}









// ========================================
// CHECK API
// ========================================

async function checkOSSAPI(){


    try{


        let result =
        await apiRequest(

            "test",

            {}

        );



        console.log(

            "OSS API TEST",

            result

        );



        return result;



    }

    catch(error){


        console.error(

            "OSS API TEST ERROR",

            error

        );


        return {

            success:false

        };


    }


}









// ========================================
// START BASIC LOAD
// ========================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    loadOSS();


});







console.log(

"OSS JS V6 UPDATE PART 1 READY"

);

// ========================================
// OSS MANAGEMENT SYSTEM V6 UPDATE
// PART 2
// CRUD + MODAL + FORM
// SAFE GLOBAL VERSION
// API.JS V4 COMPATIBLE
// ========================================



// ========================================
// INPUT HELPER
// ========================================

function getOSSInput(id){


    let el =
    document.getElementById(id);



    return el ?

    el.value.trim()

    :

    "";

}




function setOSSInput(id,value){


    let el =
    document.getElementById(id);



    if(el){

        el.value =
        value || "";

    }


}









// ========================================
// OPEN ADD OSS
// HTML:
// onclick="openAddOSS()"
// ========================================

function openAddOSS(){



    OSS_STATE.editID=null;



    resetOSSForm();



    let title =
    document.getElementById(

        "ossModalTitle"

    );



    if(title){

        title.innerHTML =
        "Tambah Data OSS";

    }





    let modal =
    document.getElementById(

        "modalOSS"

    );



    if(modal){

        modal.style.display =
        "flex";

    }



}









// ========================================
// CLOSE OSS MODAL
// ========================================

function closeOSS(){



    let modal =
    document.getElementById(

        "modalOSS"

    );



    if(modal){

        modal.style.display =
        "none";

    }



}









// ========================================
// RESET FORM
// ========================================

function resetOSSForm(){



    [

        "referenceCode",

        "custID",

        "customer",

        "city"


    ]

    .forEach(id=>{


        setOSSInput(

            id,

            ""

        );


    });



}









// ========================================
// SAVE OSS
// ADD / UPDATE
// ========================================

async function saveOSS(){



    let data={


        reference_code:

        getOSSInput(
            "referenceCode"
        ),



        cust_id:

        getOSSInput(
            "custID"
        ),



        customer:

        getOSSInput(
            "customer"
        ),



        city:

        getOSSInput(
            "city"
        )



    };






    if(
        !data.reference_code
    ){


        alert(

            "Reference Code wajib diisi"

        );


        return;


    }







    try{


        let result;






        if(
            OSS_STATE.editID
        ){



            result =

            await apiRequest(

                "updateOSS",

                {

                    id:
                    OSS_STATE.editID,

                    ...data

                }

            );



        }

        else{



            result =

            await apiRequest(

                "addOSS",

                data

            );



        }








        console.log(

            "SAVE OSS",

            result

        );






        if(
            result.success
        ){


            closeOSS();



            resetOSSForm();



            OSS_STATE.page=1;



            await loadOSS();



        }

        else{


            alert(

                result.message

            );


        }






    }


    catch(error){


        console.error(

            "SAVE OSS ERROR",

            error

        );



        alert(

            "Gagal simpan OSS"

        );



    }




}









// ========================================
// EDIT OSS
// ========================================

function editOSS(index){



    let item =
    OSS_STATE.data[index];



    if(!item)
    return;





    OSS_STATE.editID =
    item.id;





    setOSSInput(

        "referenceCode",

        item.reference_code

    );



    setOSSInput(

        "custID",

        item.cust_id

    );



    setOSSInput(

        "customer",

        item.customer

    );



    setOSSInput(

        "city",

        item.city

    );








    let title =
    document.getElementById(

        "ossModalTitle"

    );



    if(title){


        title.innerHTML =
        "Edit Data OSS";


    }





    let modal =
    document.getElementById(

        "modalOSS"

    );



    if(modal){


        modal.style.display =
        "flex";


    }



}









// ========================================
// DELETE OSS
// ========================================

async function removeOSS(index){



    let item =
    OSS_STATE.data[index];



    if(!item)
    return;






    if(
        !confirm(

            "Hapus data OSS?"

        )

    ){

        return;

    }







    try{


        let result =

        await apiRequest(

            "deleteOSS",

            {

                id:item.id

            }

        );





        console.log(

            "DELETE OSS",

            result

        );






        if(
            result.success
        ){


            await loadOSS();


        }

        else{


            alert(

                result.message

            );


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
// DUPLICATE CHECK
// ========================================

function checkDuplicateOSS(ref){



    return OSS_STATE.data.some(item=>{


        return (

            item.reference_code
            ===
            ref

        );


    });



}









// ========================================
// EXPORT GLOBAL HTML ACCESS
// ========================================

window.openAddOSS =
openAddOSS;


window.closeOSS =
closeOSS;


window.saveOSS =
saveOSS;


window.editOSS =
editOSS;


window.removeOSS =
removeOSS;


window.searchOSS =
searchOSS;







console.log(

"OSS JS V6 UPDATE PART 2 READY"

);

// ========================================
// OSS MANAGEMENT SYSTEM V6 UPDATE
// PART 3
// EXCEL + UPLOAD + EXPORT + PAGINATION
// SAFE GLOBAL VERSION
// API.JS V4 COMPATIBLE
// ========================================



// ========================================
// OPEN UPLOAD MODAL
// HTML:
// onclick="openUploadOSS()"
// ========================================

function openUploadOSS(){


    let modal =
    document.getElementById(

        "uploadOSSModal"

    );



    if(modal){


        modal.style.display =
        "flex";


    }


}









// ========================================
// CLOSE UPLOAD MODAL
// ========================================

function closeUploadOSS(){


    let modal =
    document.getElementById(

        "uploadOSSModal"

    );



    if(modal){


        modal.style.display =
        "none";


    }


}









// ========================================
// UPLOAD BUTTON
// HTML:
// onclick="uploadOSS()"
// ========================================

function uploadOSS(){



    let file =
    document.getElementById(

        "excelOSS"

    );




    if(
        !file ||
        file.files.length===0
    ){


        alert(

            "Pilih file Excel OSS"

        );


        return;


    }





    importOSSExcel(

        file.files[0]

    );



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



        let buffer =
        new Uint8Array(

            e.target.result

        );





        let workbook =
        XLSX.read(

            buffer,

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

            "IMPORT OSS DATA",

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

                "BULK OSS",

                result

            );





            if(
                result.success
            ){


                alert(

                    result.message

                );



                closeUploadOSS();



                loadOSS();



            }

            else{


                alert(

                    result.message

                );


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






    let data =

    OSS_STATE.data.map(item=>({



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

        data

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
// DOWNLOAD TEMPLATE
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

        "CUSTOMER",



        city:

        "JAKARTA"



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
// PAGINATION
// ========================================

function nextOSSPage(){



    let max =

    Math.ceil(

        OSS_STATE.total /

        OSS_STATE.limit

    );





    if(
        OSS_STATE.page < max
    ){



        OSS_STATE.page++;



        loadOSS();


    }


}









function prevOSSPage(){



    if(
        OSS_STATE.page>1
    ){



        OSS_STATE.page--;



        loadOSS();



    }



}









function renderOSSPagination(){



    let el =
    document.getElementById(

        "ossPagination"

    );



    if(!el)
    return;







    let totalPage =

    Math.ceil(

        OSS_STATE.total /

        OSS_STATE.limit

    );






    el.innerHTML = `


    <button
    onclick="prevOSSPage()">

    ◀

    </button>



    <span>

    ${OSS_STATE.page}

    /

    ${totalPage || 1}

    </span>



    <button
    onclick="nextOSSPage()">

    ▶

    </button>


    `;



}









// ========================================
// REFRESH OSS
// ========================================

async function refreshOSS(){



    OSS_STATE.page=1;



    await loadOSS();



}









// ========================================
// GLOBAL HTML ACCESS
// ========================================

window.openUploadOSS =
openUploadOSS;


window.closeUploadOSS =
closeUploadOSS;


window.uploadOSS =
uploadOSS;


window.exportOSSExcel =
exportOSSExcel;


window.downloadOSSTemplate =
downloadOSSTemplate;


window.nextOSSPage =
nextOSSPage;


window.prevOSSPage =
prevOSSPage;


window.refreshOSS =
refreshOSS;








console.log(

"OSS JS V6 UPDATE PART 3 READY"

);

// ========================================
// OSS MANAGEMENT SYSTEM V6
// PART 4
// REALTIME + DASHBOARD SYNC
// API JS V4 COMPATIBLE
// NO DUPLICATE VARIABLE
// ========================================


// ========================================
// SYSTEM STATE
// ========================================

window.OSS_SYSTEM_READY = false;


// gunakan namespace window supaya tidak bentrok
window.OSS_REFRESH_TIMER = 
window.OSS_REFRESH_TIMER || null;



// ========================================
// START OSS SYSTEM
// ========================================

async function startOSSSystem(){


    try{


        console.log(
            "START OSS V6 SYSTEM"
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



        startOSSRealtime();



        window.OSS_SYSTEM_READY = true;



        console.log(
            "OSS V6 SYSTEM READY"
        );



    }


    catch(error){


        console.error(

            "OSS SYSTEM ERROR",

            error

        );


        showLoadingOSS(false);


    }


}






// ========================================
// REALTIME AUTO REFRESH
// ========================================

function startOSSRealtime(){


    stopOSSRealtime();



    window.OSS_REFRESH_TIMER =

    setInterval(async()=>{


        try{


            await loadOSS();



            if(
                typeof refreshDashboard === "function"
            ){

                refreshDashboard();

            }



        }

        catch(err){


            console.error(

                "OSS REALTIME ERROR",

                err

            );


        }



    },60000);



}







// ========================================
// STOP REALTIME
// ========================================

function stopOSSRealtime(){



    if(
        window.OSS_REFRESH_TIMER
    ){



        clearInterval(

            window.OSS_REFRESH_TIMER

        );



        window.OSS_REFRESH_TIMER=null;



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

            !response ||

            response.success!==true ||

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
// DASHBOARD CALLBACK
// ========================================


async function syncOSSToDashboard(){



    try{


        let data =

        await getAllOSSData();



        window.OSS_DATA_TOTAL =

        data.length;




        let el =

        document.getElementById(

            "totalOSS"

        );



        if(el){


            el.innerText =

            data.length + " Data";


        }





        if(

            typeof updateDashboardOSS === "function"

        ){


            updateDashboardOSS(

                data

            );


        }




        return data;



    }


    catch(error){


        console.error(

            "SYNC DASHBOARD OSS ERROR",

            error

        );


        return [];

    }



}








// ========================================
// PRINT OSS
// ========================================

function printOSS(){


    window.print();


}







// ========================================
// BACKUP EXCEL
// ========================================

async function backupOSS(){



    let data =

    await getAllOSSData();




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

        "OSS"

    );





    XLSX.writeFile(

        wb,

        "OSS_BACKUP.xlsx"

    );



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



        loadOSS();



    }



});







// ========================================
// CLEANUP
// ========================================


window.addEventListener(

"beforeunload",

()=>{


    stopOSSRealtime();


}

);






// ========================================
// INIT
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
// DASHBOARD + MASTER SYNC
// API JS V4 FINAL INTEGRATION
// ========================================


// ========================================
// FINAL SYSTEM CONNECTOR
// ========================================


async function initOSSFinal(){


    try{


        console.log(
            "INIT OSS FINAL CONNECTOR"
        );



        await syncOSSToDashboard();



        await syncOSSMaster();



        console.log(
            "OSS FINAL SYNC READY"
        );



    }


    catch(error){


        console.error(

            "OSS FINAL INIT ERROR",

            error

        );


    }



}







// ========================================
// SYNC OSS DASHBOARD
// ========================================


async function refreshDashboardOSS(){



    try{



        let data =

        await getAllOSSData();




        let total =

        data.length;




        let card =

        document.getElementById(

            "totalOSS"

        );



        if(card){


            card.innerText =

            total + " Data";


        }






        window.DASHBOARD_DATA =

        window.DASHBOARD_DATA || {};



        window.DASHBOARD_DATA.totalOSS =

        total;





        if(

            typeof loadDashboard === "function"

        ){


            await loadDashboard();


        }



    }


    catch(error){



        console.error(

            "REFRESH DASHBOARD OSS ERROR",

            error

        );



    }



}








// ========================================
// MASTER MONITORING SYNC
// ========================================


async function syncOSSMaster(){



    try{


        let response =

        await apiRequest(

            "getMaster",

            {}

        );




        console.log(

            "MASTER OSS SYNC",

            response

        );




        if(

            response &&

            response.success

        ){



            window.MASTER_DATA =

            response.data || [];





            if(

                typeof renderMaster === "function"

            ){


                renderMaster(

                    window.MASTER_DATA

                );


            }



        }



    }


    catch(error){



        console.error(

            "SYNC MASTER ERROR",

            error

        );



    }



}









// ========================================
// MANUAL REFRESH BUTTON
// ========================================


async function refreshOSSSystem(){



    try{



        showLoadingOSS(true);




        await loadOSS();




        await refreshDashboardOSS();




        await syncOSSMaster();





        console.log(

            "OSS FULL REFRESH COMPLETE"

        );



    }


    catch(error){


        console.error(

            "OSS REFRESH ERROR",

            error

        );


    }


    finally{


        showLoadingOSS(false);


    }



}









// ========================================
// API HEALTH CHECK
// ========================================


async function checkOSSSystem(){



    try{



        let api =

        await apiRequest(

            "test",

            {}

        );



        if(api.success){


            console.log(

                "OSS API ONLINE"

            );


            return true;


        }



        return false;



    }


    catch(error){



        console.error(

            "OSS API OFFLINE",

            error

        );



        return false;



    }



}









// ========================================
// GLOBAL EXPORT
// ========================================


window.OSS_SYSTEM = {


    refresh:

    refreshOSSSystem,


    reload:

    loadOSS,


    backup:

    backupOSS,


    check:

    checkOSSSystem


};









// ========================================
// AUTO START FINAL
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    setTimeout(()=>{


        initOSSFinal();



    },500);



});







console.log(

"OSS JS V6 PART 5 FINAL READY"

);
