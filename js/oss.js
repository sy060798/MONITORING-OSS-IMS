// ========================================
// OSS MANAGEMENT SYSTEM V5
// PART 1
// API.JS V3 COMPATIBLE
// CRUD + DISPLAY FIX
// ========================================


// ========================================
// GLOBAL
// ========================================

let OSS_DATA = [];

let OSS_EDIT_ID = null;

let OSS_PAGE = 1;

let OSS_LIMIT = 100;

let OSS_TOTAL = 0;





// ========================================
// LOAD OSS FROM API
// ========================================

async function loadOSS(){


    try{


        showLoadingOSS(true);



        const response = await apiRequest(

            "getOSS",

            {

                page:OSS_PAGE,

                limit:OSS_LIMIT

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
                "API OSS ERROR"
            );

        }




        OSS_DATA = response.data || [];



        OSS_TOTAL = OSS_DATA.length;



        console.log(
            "OSS DATA DISPLAY",
            OSS_DATA
        );



        renderOSS(
            OSS_DATA
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
// RENDER TABLE OSS
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

        Belum ada data OSS

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

            class="btn edit"

            onclick="editOSS(${index})">

            ✏ Edit

            </button>



            <button

            class="btn delete"

            onclick="removeOSS(${index})">

            🗑 Hapus

            </button>


            </td>


            </tr>

            `;


        });



    }






    const tbody = document.getElementById(

        "ossData"

    );



    if(tbody){


        tbody.innerHTML = html;


    }

    else{


        console.error(

        "Element ossData tidak ditemukan"

        );


    }



}









// ========================================
// TOTAL OSS CARD
// ========================================


function updateTotalOSS(){



    let el = document.getElementById(

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


    let el=document.getElementById(

        "loadingOSS"

    );



    if(!el)return;



    el.innerHTML = state ?

    "⏳ Loading..." :

    "🟢 Ready";


}









// ========================================
// CHECK API
// ========================================


async function checkOSSAPI(){



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









// ========================================
// INIT OSS
// ========================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadOSS();


});


console.log(

"OSS JS V5 PART 1 READY"

);

// ========================================
// OSS MANAGEMENT SYSTEM V5
// PART 2
// CRUD + FORM + SEARCH
// API.JS V3 COMPATIBLE
// ========================================


// ========================================
// SAVE OSS
// ========================================

async function saveOSS(){


    let data={


        reference_code:getInputOSS(
            "referenceCode"
        ),


        cust_id:getInputOSS(
            "custID"
        ),


        customer:getInputOSS(
            "customer"
        ),


        city:getInputOSS(
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



            closeOSS();


            resetOSSForm();


            OSS_PAGE=1;


            await loadOSS();



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



    let item = OSS_DATA[index];



    if(!item)return;



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



    openAddOSS();



}









// ========================================
// DELETE OSS
// ========================================


async function removeOSS(index){



    let item = OSS_DATA[index];



    if(!item)return;




    if(!confirm(

        "Hapus data OSS?"

    )){


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


            await loadOSS();


        }





    }

    catch(error){



        console.error(

            "DELETE ERROR",

            error

        );


    }



}









// ========================================
// SEARCH OSS
// ========================================


function searchOSS(){



    let key = getInputOSS(

        "searchOSS"

    )

    .toLowerCase();






    let result = OSS_DATA.filter(item=>{



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
// INPUT HELPER
// ========================================


function getInputOSS(id){


    let el=document.getElementById(id);



    return el ?

    el.value.trim() :

    "";


}





function setInputOSS(id,value){


    let el=document.getElementById(id);



    if(el){


        el.value=value || "";


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


    ].forEach(id=>{


        setInputOSS(

            id,

            ""

        );


    });



}









// ========================================
// MODAL OPEN
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
// MODAL CLOSE
// ========================================


function closeOSS(){


    let modal=document.getElementById(

        "modalOSS"

    );



    if(modal){


        modal.style.display="none";


    }



}









console.log(

"OSS JS V5 PART 2 READY"

);

// ========================================
// OSS MANAGEMENT SYSTEM V5
// PART 3
// PAGINATION + EXCEL
// IMPORT EXPORT
// API.JS V3 COMPATIBLE
// ========================================


// ========================================
// PAGINATION
// ========================================


function nextOSSPage(){


    let maxPage = Math.ceil(

        OSS_TOTAL /

        OSS_LIMIT

    );



    if(

        OSS_PAGE < maxPage

    ){


        OSS_PAGE++;


        loadOSS();


    }


}







function prevOSSPage(){



    if(

        OSS_PAGE > 1

    ){


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

        OSS_TOTAL /

        OSS_LIMIT

    );





    el.innerHTML=`


    <button onclick="prevOSSPage()">

    ◀

    </button>


    <span>

    ${OSS_PAGE}

    /

    ${totalPage || 1}

    </span>


    <button onclick="nextOSSPage()">

    ▶

    </button>


    `;



}









// ========================================
// REFRESH DATA
// ========================================


async function refreshOSS(){



    OSS_PAGE=1;



    await loadOSS();



}









// ========================================
// IMPORT EXCEL OSS
// ========================================


function importOSSExcel(file){



    if(typeof XLSX==="undefined"){


        alert(

        "Library Excel belum aktif"

        );


        return;


    }






    let reader=new FileReader();





    reader.onload=function(e){



        let buffer = new Uint8Array(

            e.target.result

        );





        let workbook = XLSX.read(

            buffer,

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






        console.log(

            "IMPORT OSS",

            rows

        );







        bulkOSSAPI(rows)

        .then(result=>{



            console.log(

            result

            );



            if(result.success){



                alert(

                "Import OSS berhasil"

                );



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
// EXPORT EXCEL
// ========================================


function exportOSSExcel(){



    if(typeof XLSX==="undefined"){


        alert(

        "Library Excel belum aktif"

        );


        return;


    }





    let exportData = OSS_DATA.map(item=>({



        Reference_Code:

        item.reference_code || "",



        Cust_ID:

        item.cust_id || "",



        Customer:

        item.customer || "",



        City:

        item.city || ""



    }));







    let ws = XLSX.utils.json_to_sheet(

        exportData

    );





    let wb = XLSX.utils.book_new();





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
// UPLOAD BUTTON
// ========================================


function uploadOSS(){



    let input=document.getElementById(

        "fileOSS"

    );




    if(

        input &&

        input.files.length

    ){



        importOSSExcel(

            input.files[0]

        );



    }

    else{


        alert(

        "Pilih file Excel dulu"

        );


    }



}









// ========================================
// TEMPLATE EXCEL
// ========================================


function downloadOSSTemplate(){



    if(typeof XLSX==="undefined")

    return;





    let data=[{


        reference_code:"REF001",


        cust_id:"C001",


        customer:"Customer",


        city:"Jakarta"



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

        "TEMPLATE_OSS.xlsx"

    );



}








console.log(

"OSS JS V5 PART 3 READY"

);

// ========================================
// OSS JS V5 FINAL
// PART 4
// API.JS V3 COMPATIBLE
// DASHBOARD READY
// ========================================


// ========================================
// SYSTEM STATE
// ========================================

let OSS_READY=false;

let OSS_REFRESH_TIMER=null;





// ========================================
// FINAL INIT SYSTEM
// ========================================

async function startOSSSystem(){


    try{


        console.log(
            "START OSS V5 SYSTEM"
        );



        let api =
        await apiRequest(
            "test",
            {}
        );



        if(!api.success){

            throw new Error(
                "API tidak aktif"
            );

        }




        await loadOSS();



        startOSSRealtime();



        OSS_READY=true;



        console.log(
            "OSS V5 SYSTEM READY"
        );


    }


    catch(err){


        console.error(
            "OSS SYSTEM ERROR",
            err
        );


    }


}





// ========================================
// REALTIME SYNC
// ========================================

function startOSSRealtime(){


    stopOSSRealtime();



    OSS_REFRESH_TIMER =
    setInterval(()=>{


        loadOSS();


    },60000);



}




function stopOSSRealtime(){


    if(OSS_REFRESH_TIMER){


        clearInterval(
            OSS_REFRESH_TIMER
        );


        OSS_REFRESH_TIMER=null;


    }


}






// ========================================
// LOAD ALL DATA
// ========================================

async function loadAllOSS(){


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



    return all;


}






// ========================================
// BACKUP DATA OSS
// ========================================

async function backupOSS(){


    let data =
    await loadAllOSS();



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
// DELETE BULK
// ========================================

async function deleteBulkOSS(ids){


    if(
        !Array.isArray(ids)
    ){

        return;

    }



    for(
        let id of ids
    ){


        await apiRequest(

            "deleteOSS",

            {

                id:id

            }

        );


    }



    await loadOSS();


}






// ========================================
// CHECK DUPLIKAT
// ========================================

function duplicateOSS(ref){



    return OSS_DATA.some(

        item=>

        item.reference_code===ref

    );


}







// ========================================
// PRINT
// ========================================

function printOSS(){


    window.print();


}






// ========================================
// SHORTCUT
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


}

);







// ========================================
// AUTO STOP
// ========================================

window.addEventListener(

"beforeunload",

()=>{


    stopOSSRealtime();


}

);







// ========================================
// START APPLICATION
// ========================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    startOSSSystem();


}

);






console.log(
"OSS JS V5 FINAL COMPLETE"
);
