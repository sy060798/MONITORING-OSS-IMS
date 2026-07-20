// ========================================
// OSS MANAGEMENT SYSTEM V7 CLEAN FINAL
// PART 1 / 5
// CORE + LOAD + RENDER
// API JS COMPATIBLE
// ========================================


// ========================================
// CONFIG
// ========================================

const OSS_LIMIT = 100;



// ========================================
// GLOBAL STATE
// ========================================

window.OSS_STATE = {

    data: [],

    page: 1,

    limit: OSS_LIMIT,

    total: 0,

    editID: null,

    ready:false

};




// ========================================
// LOAD OSS DATA
// ========================================

async function loadOSS(){


    try{


        setOSSLoading(true);



        let result =

        await apiRequest(

            "getOSS",

            {

                page: OSS_STATE.page,

                limit: OSS_STATE.limit

            }

        );



        console.log(

            "OSS LOAD RESPONSE",

            result

        );




        if(

            !result ||

            result.success !== true

        ){

            throw new Error(

                result.message ||

                "OSS API ERROR"

            );

        }





        OSS_STATE.data =

        Array.isArray(result.data)

        ?

        result.data

        :

        [];





        OSS_STATE.total =

        OSS_STATE.data.length;





        OSS_STATE.ready=true;





        renderOSS(

            OSS_STATE.data

        );





        updateOSSCount();





        return OSS_STATE.data;



    }

    catch(error){


        console.error(

            "LOAD OSS ERROR",

            error

        );


        OSS_STATE.data=[];


        renderOSS([]);



        return [];



    }

    finally{


        setOSSLoading(false);


    }


}







// ========================================
// RENDER TABLE
// ========================================

function renderOSS(data){



    let tbody =

    document.getElementById(

        "ossData"

    );



    if(!tbody)

    return;




    let html="";





    if(

        !Array.isArray(data)

        ||

        data.length===0

    ){



        html = `

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

            onclick="editOSS(${index})"

            class="btn btn-warning">

            ✏ Edit

            </button>



            <button

            onclick="deleteOSS(${index})"

            class="btn btn-danger">

            🗑 Hapus

            </button>


            </td>


            </tr>



            `;



        });


    }





    tbody.innerHTML = html;



}









// ========================================
// UPDATE TOTAL CARD
// ========================================

function updateOSSCount(){



    let el =

    document.getElementById(

        "totalOSS"

    );



    if(el){


        el.innerText =

        OSS_STATE.total +

        " Data";


    }


}









// ========================================
// LOADING STATUS
// ========================================

function setOSSLoading(status){



    let el =

    document.getElementById(

        "loadingOSS"

    );



    if(!el)

    return;



    el.innerText =


    status

    ?

    "⏳ Loading..."

    :

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


    input

    ?

    input.value.toLowerCase()

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
// API CHECK OSS
// ========================================

async function checkOSSAPI(){


    try{


        let result =

        await apiRequest(

            "test",

            {}

        );



        return result;



    }

    catch(error){



        console.error(

            "OSS API CHECK ERROR",

            error

        );



        return {

            success:false

        };


    }


}









// ========================================
// REFRESH MANUAL
// ========================================

async function refreshOSS(){



    OSS_STATE.page=1;


    await loadOSS();



}









// ========================================
// GLOBAL ACCESS
// ========================================

window.loadOSS =
loadOSS;


window.renderOSS =
renderOSS;


window.searchOSS =
searchOSS;


window.refreshOSS =
refreshOSS;


window.checkOSSAPI =
checkOSSAPI;





console.log(

"OSS JS V7 CLEAN PART 1 READY"

);

// ========================================
// OSS MANAGEMENT SYSTEM V7 CLEAN FINAL
// PART 2 / 5
// CRUD + MODAL + FORM
// API JS COMPATIBLE
// ========================================


// ========================================
// FORM HELPER
// ========================================

function getOSSValue(id){


    let el =

    document.getElementById(id);



    return el

    ?

    el.value.trim()

    :

    "";



}



function setOSSValue(id,value){


    let el =

    document.getElementById(id);



    if(el){


        el.value =

        value || "";


    }


}







// ========================================
// OPEN ADD MODAL
// ========================================

function openAddOSS(){



    OSS_STATE.editID=null;



    clearOSSForm();



    let title =

    document.getElementById(

        "ossModalTitle"

    );



    if(title){


        title.innerText =

        "Tambah Data OSS";


    }



    openOSSModal();



}







// ========================================
// OPEN MODAL
// ========================================

function openOSSModal(){



    let modal =

    document.getElementById(

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



    let modal =

    document.getElementById(

        "modalOSS"

    );



    if(modal){


        modal.style.display="none";


    }



}








// ========================================
// RESET FORM
// ========================================

function clearOSSForm(){



    [

        "referenceCode",

        "custID",

        "customer",

        "city"


    ]

    .forEach(id=>{


        setOSSValue(

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



    let data = {


        reference_code:

        getOSSValue(

            "referenceCode"

        ),



        cust_id:

        getOSSValue(

            "custID"

        ),



        customer:

        getOSSValue(

            "customer"

        ),



        city:

        getOSSValue(

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





        if(OSS_STATE.editID){



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

            "SAVE OSS RESULT",

            result

        );








        if(

            result &&

            result.success

        ){



            alert(

                "Data OSS berhasil disimpan"

            );



            closeOSS();



            clearOSSForm();



            await loadOSS();



        }

        else{



            alert(

                result.message ||

                "Simpan OSS gagal"

            );


        }




    }

    catch(error){



        console.error(

            "SAVE OSS ERROR",

            error

        );



        alert(

            "Terjadi error saat simpan"

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







    setOSSValue(

        "referenceCode",

        item.reference_code

    );



    setOSSValue(

        "custID",

        item.cust_id

    );



    setOSSValue(

        "customer",

        item.customer

    );



    setOSSValue(

        "city",

        item.city

    );







    let title =

    document.getElementById(

        "ossModalTitle"

    );



    if(title){


        title.innerText =

        "Edit Data OSS";


    }






    openOSSModal();



}









// ========================================
// DELETE OSS
// ========================================

async function deleteOSS(index){



    let item =

    OSS_STATE.data[index];



    if(!item)

    return;







    if(

        !confirm(

            "Hapus data OSS ini?"

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

            "DELETE OSS RESULT",

            result

        );







        if(

            result &&

            result.success

        ){



            alert(

                "Data OSS berhasil dihapus"

            );



            await loadOSS();



        }

        else{



            alert(

                result.message ||

                "Gagal hapus OSS"

            );


        }






    }

    catch(error){



        console.error(

            "DELETE OSS ERROR",

            error

        );



        alert(

            "Error hapus data"

        );


    }



}









// ========================================
// DUPLICATE CHECK
// ========================================

function duplicateOSS(reference){



    return OSS_STATE.data.some(item=>{


        return String(

            item.reference_code || ""

        )

        ===

        String(reference || "");



    });



}









// ========================================
// CLOSE ESC
// ========================================

document.addEventListener(

"keydown",

function(e){


    if(e.key==="Escape"){


        closeOSS();


    }


});









// ========================================
// GLOBAL ACCESS
// ========================================

window.openAddOSS =
openAddOSS;


window.closeOSS =
closeOSS;


window.saveOSS =
saveOSS;


window.editOSS =
editOSS;


window.deleteOSS =
deleteOSS;


window.duplicateOSS =
duplicateOSS;





console.log(

"OSS JS V7 CLEAN PART 2 READY"

);

// ========================================
// OSS JS V6 CLEAN
// TAHAP 3 / 5
// CRUD SYSTEM
// ADD + EDIT + DELETE
// ========================================


// ========================================
// OPEN ADD MODAL
// ========================================

function openAddOSS(){


    OSS_STATE.editID = null;


    resetOSSForm();



    let title =
    document.getElementById(
        "ossModalTitle"
    );


    if(title){

        title.innerText =
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
// CLOSE MODAL
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
// FORM HELPER
// ========================================


function getOSSValue(id){


    let el =
    document.getElementById(id);


    return el ?

    el.value.trim()

    :

    "";

}




function setOSSValue(id,value){


    let el =
    document.getElementById(id);


    if(el){

        el.value =
        value || "";

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


        setOSSValue(
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



    let data = {


        reference_code:

        getOSSValue(
            "referenceCode"
        ),



        cust_id:

        getOSSValue(
            "custID"
        ),



        customer:

        getOSSValue(
            "customer"
        ),



        city:

        getOSSValue(
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



        // UPDATE

        if(OSS_STATE.editID){



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



        // ADD

        else{


            result =

            await apiRequest(

                "addOSS",

                data

            );


        }







        console.log(

            "SAVE OSS RESULT",

            result

        );







        if(result.success){



            closeOSS();



            await loadOSS();



        }

        else{


            alert(

                result.message ||

                "Gagal simpan"

            );


        }




    }


    catch(error){


        console.error(

            "SAVE OSS ERROR",

            error

        );


        alert(
            "Error simpan OSS"
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








    setOSSValue(

        "referenceCode",

        item.reference_code

    );



    setOSSValue(

        "custID",

        item.cust_id

    );



    setOSSValue(

        "customer",

        item.customer

    );



    setOSSValue(

        "city",

        item.city

    );








    let title =

    document.getElementById(

        "ossModalTitle"

    );



    if(title){


        title.innerText =

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


async function deleteOSS(index){



    let item =

    OSS_STATE.data[index];



    if(!item)

    return;







    let yakin =

    confirm(

        "Hapus data OSS ini?"

    );



    if(!yakin)

    return;







    try{



        let result =

        await apiRequest(

            "deleteOSS",

            {

                id:item.id

            }

        );






        console.log(

            "DELETE RESULT",

            result

        );







        if(result.success){


            await loadOSS();


        }

        else{


            alert(

                result.message ||

                "Gagal hapus"

            );


        }





    }


    catch(error){


        console.error(

            "DELETE OSS ERROR",

            error

        );


        alert(

            "Error hapus OSS"

        );


    }



}









// ========================================
// DUPLICATE CHECK
// ========================================


function duplicateOSS(ref){



    return OSS_STATE.data.some(item=>{


        return String(

            item.reference_code

        )

        ===

        String(ref);



    });



}










// ========================================
// GLOBAL ACCESS
// ========================================


window.openAddOSS =
openAddOSS;


window.closeOSS =
closeOSS;


window.saveOSS =
saveOSS;


window.editOSS =
editOSS;


window.deleteOSS =
deleteOSS;


window.duplicateOSS =
duplicateOSS;





console.log(

"OSS JS V6 CLEAN TAHAP 3 READY"

);


// ========================================
// OSS JS V6 CLEAN
// TAHAP 4 / 5
// EXCEL TOOLS + BACKUP
// ========================================



// ========================================
// OPEN UPLOAD MODAL
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
// NORMALIZE EXCEL HEADER
// ========================================


function normalizeOSSExcel(row){



    return {


        reference_code:

        row.reference_code ||

        row.Reference_Code ||

        row["Reference Code"] ||

        row.REFERENCE_CODE ||

        "",




        cust_id:

        row.cust_id ||

        row.Cust_ID ||

        row["Cust ID"] ||

        row.CUST_ID ||

        "",





        customer:

        row.customer ||

        row.Customer ||

        row.CUSTOMER ||

        "",





        city:

        row.city ||

        row.City ||

        row.CITY ||

        ""



    };



}









// ========================================
// IMPORT EXCEL
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








    reader.onload = function(e){



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








        if(!raw.length){


            alert(

                "File Excel kosong"

            );


            return;


        }








        let rows =

        raw.map(row=>{


            return normalizeOSSExcel(row);


        });







        let invalid =

        rows.filter(row=>{


            return !row.reference_code;


        });








        if(invalid.length){



            console.log(

                "DATA INVALID",

                invalid

            );



            alert(

                "Ada data tanpa Reference Code"

            );



            return;


        }








        console.log(

            "UPLOAD OSS DATA",

            rows

        );








        bulkOSS(rows);



    };








    reader.readAsArrayBuffer(file);




}









// ========================================
// BULK INSERT API
// ========================================


async function bulkOSS(rows){



    try{



        let result =

        await apiRequest(

            "bulkOSS",

            rows

        );






        console.log(

            "BULK OSS RESULT",

            result

        );








        if(result.success){



            alert(

`Upload OSS selesai

Total : ${result.total || rows.length}

Masuk : ${result.inserted || 0}

Duplikat : ${result.duplicate || 0}`

            );




            closeUploadOSS();



            await loadOSS();



        }

        else{


            alert(

                result.message ||

                "Upload gagal"

            );


        }






    }


    catch(error){



        console.error(

            "BULK OSS ERROR",

            error

        );



        alert(

            "Upload OSS error"

        );


    }



}









// ========================================
// BUTTON FILE
// ========================================


function uploadOSS(){



    let input =

    document.getElementById(

        "excelOSS"

    );





    if(

        !input ||

        !input.files.length

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

            "Library Excel belum aktif"

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

        item.city || ""



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
// BACKUP OSS FULL
// ========================================


async function backupOSS(){



    try{



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

            "BACKUP_OSS.xlsx"

        );




    }


    catch(error){



        console.error(

            "BACKUP ERROR",

            error

        );



    }




}









// ========================================
// GLOBAL ACCESS
// ========================================


window.openUploadOSS =
openUploadOSS;


window.closeUploadOSS =
closeUploadOSS;


window.uploadOSS =
uploadOSS;


window.importOSSExcel =
importOSSExcel;


window.bulkOSS =
bulkOSS;


window.exportOSSExcel =
exportOSSExcel;


window.backupOSS =
backupOSS;






console.log(

"OSS JS V6 CLEAN TAHAP 4 READY"

);


// ========================================
// OSS JS V6 CLEAN
// TAHAP FINAL 5 / 5
// SYSTEM CONTROL + REALTIME
// ========================================



// ========================================
// SYSTEM STATE
// ========================================


window.OSS_SYSTEM =

window.OSS_SYSTEM || {


    ready:false,

    timer:null,

    interval:60000


};









// ========================================
// API CHECK
// ========================================


async function checkOSSAPI(){



    try{


        let result =

        await apiRequest(

            "test",

            {}

        );



        console.log(

            "OSS API CHECK",

            result

        );



        return (

            result &&

            result.success===true

        );



    }

    catch(error){



        console.error(

            "API CHECK ERROR",

            error

        );


        return false;


    }



}









// ========================================
// DASHBOARD SYNC
// ========================================


async function syncOSSFinal(){



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

            total +

            " Data";


        }








        window.OSS_TOTAL = total;






        if(

            typeof updateDashboardOSS ===

            "function"

        ){


            updateDashboardOSS(

                data

            );


        }







        return data;



    }


    catch(error){



        console.error(

            "SYNC OSS ERROR",

            error

        );


        return [];



    }



}









// ========================================
// REFRESH FULL OSS
// ========================================


async function refreshOSS(){



    try{



        console.log(

            "REFRESH OSS START"

        );




        await loadOSS();



        await syncOSSFinal();





        console.log(

            "REFRESH OSS COMPLETE"

        );



    }


    catch(error){



        console.error(

            "REFRESH OSS ERROR",

            error

        );


    }



}









// ========================================
// REALTIME START
// ========================================


function startOSSRealtime(){



    stopOSSRealtime();





    window.OSS_SYSTEM.timer =


    setInterval(()=>{


        refreshOSS();



    },

    window.OSS_SYSTEM.interval

    );







    console.log(

        "OSS REALTIME ACTIVE"

    );



}









// ========================================
// STOP REALTIME
// ========================================


function stopOSSRealtime(){



    if(

        window.OSS_SYSTEM.timer

    ){



        clearInterval(

            window.OSS_SYSTEM.timer

        );



        window.OSS_SYSTEM.timer=null;



    }



}









// ========================================
// INIT SYSTEM
// ========================================


async function initOSSSystem(){



    try{



        console.log(

            "START OSS V6 CLEAN"

        );






        let online =

        await checkOSSAPI();







        if(!online){


            throw new Error(

                "API OFFLINE"

            );


        }








        await loadOSS();




        await syncOSSFinal();






        startOSSRealtime();






        window.OSS_SYSTEM.ready=true;







        console.log(

            "================================"

        );



        console.log(

            "OSS V6 CLEAN READY"

        );



        console.log(

            "ALL TOOLS ACTIVE"

        );



        console.log(

            "================================"

        );





    }


    catch(error){



        console.error(

            "INIT OSS ERROR",

            error

        );



    }




}









// ========================================
// MANUAL BUTTON SUPPORT
// ========================================


window.refreshOSS =

refreshOSS;


window.checkOSSAPI =

checkOSSAPI;


window.startOSSRealtime =

startOSSRealtime;


window.stopOSSRealtime =

stopOSSRealtime;


window.initOSSSystem =

initOSSSystem;









// ========================================
// AUTO START ONE TIME
// ========================================


if(

    !window.OSS_INIT_RUNNING

){



    window.OSS_INIT_RUNNING=true;



    document.addEventListener(

        "DOMContentLoaded",

        ()=>{


            initOSSSystem();


        }

    );



}









// ========================================
// CLEANUP
// ========================================


window.addEventListener(

"beforeunload",

()=>{


    stopOSSRealtime();


});








console.log(

"OSS JS V6 CLEAN FINAL READY"

);
